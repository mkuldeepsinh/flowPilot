import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import dbConnect from '../../../../dbConfing/dbConfing';
import User from '../../../../models/userModel';
import Company from '../../../../models/companyModel';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL!);
    }

    const token = (await cookies()).get('token')?.value || '';

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    let decodedToken: any;
    try {
      decodedToken = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const company = await Company.findOne({ companyId: user.companyId });

    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.email, // Assuming email is used as name or you have a name field
        companyId: user.companyId,
      },
      company: {
        companyName: company.companyName,
        companyId: company.companyId,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Fetch user/company data error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 