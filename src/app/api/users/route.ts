import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/dbConfing/dbConfing';
import User from '@/models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
} 