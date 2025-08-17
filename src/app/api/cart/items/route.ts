import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartItemsTable, productsTable, cartTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, productId, quantity = 1 } = body;

    if (!cartId || !productId) {
      return NextResponse.json(
        { error: 'Cart ID and product ID are required' },
        { status: 400 }
      );
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.id, cartId)
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const product = await db.query.productsTable.findFirst({
      where: eq(productsTable.id, productId)
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    const existingItem = await db.query.cartItemsTable.findFirst({
      where: and(
        eq(cartItemsTable.cartId, cartId),
        eq(cartItemsTable.productId, productId)
      )
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      await db.update(cartItemsTable)
        .set({ 
          quantity: newQuantity,
          updatedAt: new Date()
        })
        .where(eq(cartItemsTable.id, existingItem.id));
    } else {
      await db.insert(cartItemsTable).values({
        cartId,
        productId,
        quantity,
        price: product.price
      });
    }

    const updatedCart = await db.query.cartTable.findFirst({
      where: eq(cartTable.id, cartId),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(updatedCart, { status: 201 });

  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.id, cartItemId));
    } else {
      await db.update(cartItemsTable)
        .set({ 
          quantity,
          updatedAt: new Date()
        })
        .where(eq(cartItemsTable.id, cartItemId));
    }

    return NextResponse.json({ message: 'Cart item updated successfully' });

  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, parseInt(cartItemId)));

    return NextResponse.json({ message: 'Item removed from cart' });

  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
