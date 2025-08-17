import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartTable, cartItemsTable, productsTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
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

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const subtotal = cart.items.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return NextResponse.json({
      ...cart,
      totals: { subtotal, tax, total }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    const [cart] = await db.insert(cartTable).values({
      userId: userId || null
    }).returning();

    return NextResponse.json(cart, { status: 201 });

  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, userId } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const [updatedCart] = await db.update(cartTable)
      .set({ 
        userId,
        updatedAt: new Date()
      })
      .where(eq(cartTable.id, cartId))
      .returning();

    return NextResponse.json(updatedCart);

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
