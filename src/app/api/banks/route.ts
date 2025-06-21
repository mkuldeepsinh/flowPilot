import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/dbConfing/dbConfing';
import Bank from '@/models/bankModel';
import User from '@/models/userModel';

// GET - Fetch all banks for the company
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get user and their company ID
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user || !user.companyId) {
      return NextResponse.json({ error: 'User not found or no company associated' }, { status: 404 });
    }

    // Fetch all banks for the company
    const banks = await Bank.findByCompanyId(user.companyId);
    
    return NextResponse.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new bank
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get user and their company ID
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user || !user.companyId) {
      return NextResponse.json({ error: 'User not found or no company associated' }, { status: 404 });
    }

    const body = await request.json();
    const { bankName, ifscCode, accountNumber, accountType, currentAmount } = body;

    // Validate required fields
    if (!bankName || !ifscCode || !accountNumber || !accountType || currentAmount === undefined) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate account type
    if (!['saving', 'current'].includes(accountType)) {
      return NextResponse.json({ error: 'Account type must be either saving or current' }, { status: 400 });
    }

    // Validate current amount
    if (typeof currentAmount !== 'number' || currentAmount < 0) {
      return NextResponse.json({ error: 'Current amount must be a non-negative number' }, { status: 400 });
    }

    // Check if bank account already exists for this company
    const existingBank = await Bank.findOne({ 
      companyId: user.companyId, 
      accountNumber: accountNumber 
    });

    if (existingBank) {
      return NextResponse.json({ error: 'Bank account with this account number already exists' }, { status: 400 });
    }

    // Create new bank
    const newBank = new Bank({
      bankName,
      ifscCode: ifscCode.toUpperCase(),
      accountNumber,
      accountType,
      currentAmount,
      companyId: user.companyId
    });

    await newBank.save();
    
    return NextResponse.json(newBank, { status: 201 });
  } catch (error) {
    console.error('Error creating bank:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 