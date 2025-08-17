import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ordersTable, orderStatusHistoryTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId),
      with: {
        user: true,
        items: {
          with: {
            product: true
          }
        },
        statusHistory: {
          orderBy: [orderStatusHistoryTable.createdAt]
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus, adminNotes } = body;

    const existingOrder = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId)
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const [updatedOrder] = await db.update(ordersTable)
      .set({
        status: status || existingOrder.status,
        paymentStatus: paymentStatus || existingOrder.paymentStatus,
        adminNotes: adminNotes !== undefined ? adminNotes : existingOrder.adminNotes,
        updatedAt: new Date()
      })
      .where(eq(ordersTable.id, orderId))
      .returning();

    await db.insert(orderStatusHistoryTable).values({
      orderId,
      status: status || existingOrder.status,
      paymentStatus: paymentStatus || existingOrder.paymentStatus,
      changedBy: 'admin',
      notes: adminNotes || 'Status updated'
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
