import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Clear the token cookie by setting its expiration to a past date
    (await cookies()).set({
      name: 'token',
      value: '',
      
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || true,
      sameSite: 'strict',
      expires: new Date(0), // Set expiry to a past date
    });

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 