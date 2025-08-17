import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categoriesTable } from '@/lib/schema';
import { eq, like, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const active = searchParams.get('active');

    const whereConditions = [];
    
    if (active !== null) {
      whereConditions.push(eq(categoriesTable.isActive, active === 'true'));
    }
    
    if (search) {
      whereConditions.push(like(categoriesTable.name, `%${search}%`));
    }

    const categories = await db.query.categoriesTable.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        products: {
          where: eq(categoriesTable.isActive, true)
        }
      },
      orderBy: [desc(categoriesTable.createdAt)]
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const existingCategory = await db.query.categoriesTable.findFirst({
      where: eq(categoriesTable.name, name)
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 400 }
      );
    }

    const existingSlug = await db.query.categoriesTable.findFirst({
      where: eq(categoriesTable.slug, slug)
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Category slug already exists' },
        { status: 400 }
      );
    }

    const [category] = await db.insert(categoriesTable).values({
      name,
      description,
      slug,
      isActive: true
    }).returning();

    return NextResponse.json(category, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
