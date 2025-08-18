import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartItemsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { quantity } = body;
    const itemId = parseInt(params.id);

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const [updatedItem] = await db
      .update(cartItemsTable)
      .set({ 
        quantity,
        updatedAt: new Date()
      })
      .where(eq(cartItemsTable.id, itemId))
      .returning();

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem);

  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const [deletedItem] = await db
      .delete(cartItemsTable)
      .where(eq(cartItemsTable.id, itemId))
      .returning();

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    );
  }
}
