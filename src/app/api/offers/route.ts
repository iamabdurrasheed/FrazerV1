import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { offersTable, productOffersTable } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const whereConditions = [];
    
    if (active !== null) {
      whereConditions.push(eq(offersTable.isActive, active === 'true'));
    }

    const offers = await db.query.offersTable.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        productOffers: {
          with: {
            product: true
          }
        }
      },
      orderBy: [desc(offersTable.createdAt)],
      limit,
      offset
    });

    const totalCount = await db
      .select({ count: offersTable.id })
      .from(offersTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return NextResponse.json({
      offers,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, discountPercentage, startDate, endDate, productIds } = body;

    if (!title || !discountPercentage || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (discountPercentage <= 0 || discountPercentage > 100) {
      return NextResponse.json(
        { error: 'Discount percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const [offer] = await db.insert(offersTable).values({
      title,
      description,
      discountPercentage,
      startDate: start,
      endDate: end,
      isActive: true
    }).returning();

    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      const productOffers = productIds.map(productId => ({
        productId,
        offerId: offer.id
      }));

      await db.insert(productOffersTable).values(productOffers);
    }

    return NextResponse.json(offer, { status: 201 });

  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
