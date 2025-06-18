import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/dbConfing/dbConfing';
import User from '@/models/userModel';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching user profile...');
    
    // Get the session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();
    
    // Find user
    const user = await User.findOne({ email: session.user.email, isActive: true });
    
    if (!user) {
      console.log('User not found:', session.user.email);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('User found:', user._id);

    // Return user profile
    return NextResponse.json({
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: user.companyName,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 