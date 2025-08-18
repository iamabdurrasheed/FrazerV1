import { NextResponse } from 'next/server';

// Import the shared OTP store from send-otp
import { verifyOTP } from '../send-otp/route';

export async function POST(request: Request) {
  try {
    const { identifier, otp } = await request.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: 'Identifier and OTP are required' },
        { status: 400 }
      );
    }

    // Use the verifyOTP function from send-otp route
    const isValid = verifyOTP(identifier, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'OTP verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
