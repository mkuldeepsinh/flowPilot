import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../dbConfing/dbConfing';
import User from '../../../../models/userModel';
import Company from '../../../../models/companyModel';
import { validateSignupData } from '../../../../helpers/validation';

function generateCompanyId() {
    return `COMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const reqBody = await request.json();
    const { isNewCompany, ...userData } = reqBody;
    
    const validation = validateSignupData(userData, isNewCompany);
    if (!validation.isValid) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      }, { status: 400 });
    }

    if (isNewCompany) {
      // Create new company and admin user
      const { companyName, email, password } = userData;
      
      const existingCompany = await Company.findOne({ 
        companyName: { $regex: new RegExp(companyName, 'i') } 
      });
      
      if (existingCompany) {
        return NextResponse.json({ 
          message: 'Company name already exists' 
        }, { status: 400 });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ 
          message: 'Email already registered' 
        }, { status: 400 });
      }

      // Create company
      const company = new Company({
        companyName,
        adminEmail: email,
        companyId: generateCompanyId()
      });
      
      await company.save();

      // Create admin user
      const user = new User({
        email,
        password,
        role: 'admin',
        companyId: company.companyId,
        companyName: company.companyName
      });

      await user.save();

      return NextResponse.json({
        message: 'Company and admin user created successfully',
        companyId: company.companyId,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: user.companyName
        }
      }, { status: 201 });

    } else {
      // Register user to existing company
      const { companyId, email, password, role } = userData;
      
      const company = await Company.findOne({ companyId, isActive: true });
      if (!company) {
        return NextResponse.json({ 
          message: 'Invalid company ID' 
        }, { status: 400 });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ 
          message: 'Email already registered' 
        }, { status: 400 });
      }

      const user = new User({
        email,
        password,
        role,
        companyId: company.companyId,
        companyName: company.companyName
      });

      await user.save();

      return NextResponse.json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: user.companyName
        }
      }, { status: 201 });
    }

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
