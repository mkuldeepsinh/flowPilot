import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../dbConfing/dbConfing';
import User from '../../../../models/userModel';
import { validateLoginData } from '@/helpers/validation';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const reqBody = await request.json();
    const { email, password } = reqBody;
    
    const validation = validateLoginData({ email, password });
    if (!validation.isValid) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      }, { status: 400 });
    }

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return NextResponse.json({ 
        message: 'Invalid email or password' 
      }, { status: 401 });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ 
        message: 'Invalid email or password' 
      }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.companyName,
        lastLogin: user.lastLogin
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
