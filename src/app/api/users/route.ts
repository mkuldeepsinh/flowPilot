import { NextResponse } from 'next/server';
import dbConnect from '@/dbConfing/dbConfing';
import User from '@/models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // In a multi-tenant app, you might want to filter by companyId
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const users = await User.find({ companyId: currentUser.companyId }).select('id name email role');

    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
} 