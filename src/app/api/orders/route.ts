import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ordersTable, orderItemsTable, orderStatusHistoryTable, cartTable, cartItemsTable } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const whereConditions = [];
    
    if (userId) {
      whereConditions.push(eq(ordersTable.userId, parseInt(userId)));
    }
    
    if (status) {
      whereConditions.push(eq(ordersTable.status, status as 'pending' | 'approved' | 'cancelled'));
    }
    
    if (paymentStatus) {
      whereConditions.push(eq(ordersTable.paymentStatus, paymentStatus as 'pending' | 'verified' | 'failed'));
    }

    const orders = await db.query.ordersTable.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        user: true,
        items: {
          with: {
            product: true
          }
        },
        statusHistory: {
          orderBy: [desc(orderStatusHistoryTable.createdAt)]
        }
      },
      orderBy: [desc(ordersTable.createdAt)],
      limit,
      offset
    });

    const totalCount = await db
      .select({ count: ordersTable.id })
      .from(ordersTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, userId, shippingAddress, billingAddress, paymentDetails } = body;

    if (!cartId || !userId || !shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.id, cartId),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or not found' },
        { status: 400 }
      );
    }

    const subtotal = cart.items.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const orderNumber = `ORD-${year}${month}${day}-${Date.now()}`;

    const [order] = await db.insert(ordersTable).values({
      orderNumber,
      userId,
      subtotal: subtotal.toString(),
      tax: tax.toString(),
      total: total.toString(),
      shippingAddress,
      billingAddress,
      paymentDetails: paymentDetails || {},
      status: 'pending',
      paymentStatus: 'pending'
    }).returning();

    const orderItems = cart.items.map((item: any) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.product.name,
      productSku: item.product.sku,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: (Number(item.price) * item.quantity).toString()
    }));

    await db.insert(orderItemsTable).values(orderItems);

    await db.insert(orderStatusHistoryTable).values({
      orderId: order.id,
      status: 'pending',
      paymentStatus: 'pending',
      changedBy: 'system',
      notes: 'Order created'
    });

    await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));

    const createdOrder = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, order.id),
      with: {
        user: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(createdOrder, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
