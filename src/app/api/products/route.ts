import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/schema';
import { eq, and, like, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const whereConditions = [eq(productsTable.isActive, true)];
    
    if (category) {
      whereConditions.push(eq(productsTable.categoryId, parseInt(category)));
    }
    
    if (search) {
      whereConditions.push(like(productsTable.name, `%${search}%`));
    }

    const products = await db.query.productsTable.findMany({
      where: and(...whereConditions),
      with: {
        category: true
      },
      orderBy: [desc(productsTable.createdAt)],
      limit,
      offset
    });

    const totalCount = await db
      .select({ count: productsTable.id })
      .from(productsTable)
      .where(and(...whereConditions));

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, originalPrice, sku, stockQuantity, categoryId, images } = body;

    if (!name || !price || !sku || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingProduct = await db.query.productsTable.findFirst({
      where: eq(productsTable.sku, sku)
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    const [product] = await db.insert(productsTable).values({
      name,
      description,
      price,
      originalPrice,
      sku,
      stockQuantity: stockQuantity || 0,
      categoryId,
      images: images || [],
      isActive: true
    }).returning();

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
