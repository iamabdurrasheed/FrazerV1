import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usersTable } from '@/lib/schema';
import { eq, like, desc, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const whereConditions = [];
    
    if (search) {
      whereConditions.push(like(usersTable.name, `%${search}%`));
    }

    const users = await db.query.usersTable.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        orders: {
          orderBy: [desc(usersTable.createdAt)]
        }
      },
      orderBy: [desc(usersTable.createdAt)],
      limit,
      offset
    });

    const totalCount = await db
      .select({ count: usersTable.id })
      .from(usersTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, password, address, city, state, zipCode, country = 'US' } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate password if provided
    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email)
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [user] = await db.insert(usersTable).values({
      email,
      name,
      phone,
      password: hashedPassword,
      address,
      city,
      state,
      zipCode,
      country
    }).returning();

    // Remove password from response
    const { password: _, ...userResponse } = user;

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
