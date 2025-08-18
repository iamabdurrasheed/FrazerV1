import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usersTable } from '@/lib/schema';
import { eq, or } from 'drizzle-orm';

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simulate sending email OTP (replace with actual email service)
async function sendEmailOTP(email: string, otp: string): Promise<boolean> {
  try {
    // In production, integrate with services like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    console.log(`Email OTP for ${email}: ${otp}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Email OTP sending failed:', error);
    return false;
  }
}

// Simulate sending SMS OTP (replace with actual SMS service)
async function sendSMSOTP(phone: string, otp: string): Promise<boolean> {
  try {
    // In production, integrate with services like:
    // - Twilio
    // - AWS SNS
    // - MessageBird
    console.log(`SMS OTP for ${phone}: ${otp}`);
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('SMS OTP sending failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, method } = body;

    if (!method || (method !== 'email' && method !== 'phone')) {
      return NextResponse.json(
        { error: 'Invalid method. Use email or phone.' },
        { status: 400 }
      );
    }

    if (method === 'email' && !email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (method === 'phone' && !phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const whereClause = method === 'email' 
      ? eq(usersTable.email, email)
      : eq(usersTable.phone, phone);

    const existingUser = await db.query.usersTable.findFirst({
      where: whereClause
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: `No account found with this ${method === 'email' ? 'email' : 'phone number'}. Please register first.` },
        { status: 404 }
      );
    }

    const identifier = method === 'email' ? email : phone;
    
    // Check rate limiting (max 3 attempts per 15 minutes)
    const existing = otpStore.get(identifier);
    if (existing && existing.attempts >= 3 && Date.now() < existing.expires) {
      const remainingTime = Math.ceil((existing.expires - Date.now()) / (1000 * 60));
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${remainingTime} minutes.` },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const expires = Date.now() + (15 * 60 * 1000); // 15 minutes
    const attempts = existing && Date.now() < existing.expires ? existing.attempts + 1 : 1;

    // Store OTP
    otpStore.set(identifier, { otp, expires, attempts });

    // Send OTP
    let success = false;
    if (method === 'email') {
      success = await sendEmailOTP(email, otp);
    } else {
      success = await sendSMSOTP(phone, otp);
    }

    if (!success) {
      return NextResponse.json(
        { error: `Failed to send OTP via ${method}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `OTP sent successfully to your ${method === 'email' ? 'email' : 'phone number'}`,
      expires: new Date(expires).toISOString()
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify OTP function (to be used in auth)
export function verifyOTP(identifier: string, inputOtp: string): boolean {
  const stored = otpStore.get(identifier);
  
  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(identifier);
    return false;
  }

  if (stored.otp === inputOtp) {
    otpStore.delete(identifier);
    return true;
  }

  return false;
}
