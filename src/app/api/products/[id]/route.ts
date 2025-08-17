import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await db.query.productsTable.findFirst({
      where: eq(productsTable.id, productId),
      with: {
        category: true,
        productOffers: {
          with: {
            offer: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, price, originalPrice, sku, stockQuantity, categoryId, images, isActive } = body;

    const existingProduct = await db.query.productsTable.findFirst({
      where: eq(productsTable.id, productId)
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (sku && sku !== existingProduct.sku) {
      const skuExists = await db.query.productsTable.findFirst({
        where: eq(productsTable.sku, sku)
      });

      if (skuExists) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        );
      }
    }

    const [updatedProduct] = await db.update(productsTable)
      .set({
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price || existingProduct.price,
        originalPrice: originalPrice !== undefined ? originalPrice : existingProduct.originalPrice,
        sku: sku || existingProduct.sku,
        stockQuantity: stockQuantity !== undefined ? stockQuantity : existingProduct.stockQuantity,
        categoryId: categoryId || existingProduct.categoryId,
        images: images || existingProduct.images,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        updatedAt: new Date()
      })
      .where(eq(productsTable.id, productId))
      .returning();

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const existingProduct = await db.query.productsTable.findFirst({
      where: eq(productsTable.id, productId)
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.update(productsTable)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(productsTable.id, productId));

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
