import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Transaction from "@/models/transactionModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/dbConfing/dbConfing";
import User from "@/models/userModel";
import Bank from "@/models/bankModel";
// import { mockCompany } from "@/lib/dashboard"; // This will be removed as we'll use dynamic companyId
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Default colors for different categories
export const categoryColors: Record<string, string> = {
  Revenue: "#22C55E",
  Payroll: "#3B82F6",
  Operations: "#6B7280",
  "IT Expenses": "#8B5CF6",
  Facilities: "#F59E42",
  Marketing: "#EC4899",
  Travel: "#14B8A6",
  Insurance: "#6366F1",
  Tax: "#EF4444",
  Other: "#6B7280"
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized: No session" }, { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email, isActive: true }).lean();
    if (!user || !user.companyId) {
      return NextResponse.json({ error: "Company ID not found for user" }, { status: 400 });
    }
    const companyId = user.companyId;
    const transactions = await Transaction.find({ companyId }).lean();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized: No session" }, { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email, isActive: true }).lean();
    if (!user || !user.companyId) {
      return NextResponse.json({ error: "Company ID not found for user" }, { status: 400 });
    }
    const companyId = user.companyId;
    const data = await request.json();

    // Validate bank balance for expense transactions
    if (data.type === 'expense') {
      const bank = await Bank.findOne({ 
        companyId: companyId, 
        bankName: data.account 
      });
      
      if (!bank) {
        return NextResponse.json({ 
          error: 'Bank account not found' 
        }, { status: 400 });
      }
      
      if (parseFloat(data.amount) > bank.currentAmount) {
        return NextResponse.json({ 
          error: `Transaction failed: Demanded amount (${parseFloat(data.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}) is bigger than current amount (${bank.currentAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}) in ${bank.bankName}` 
        }, { status: 400 });
      }
    }

    // Add companyId and default values
    const transactionData = {
      ...data,
      companyId: companyId,
      date: new Date(data.date),
      amount: parseFloat(data.amount),
      // Set color based on category
      color: categoryColors[data.category] || "#6B7280", // Default gray if category not found
      // Set department to "All" if not provided
      department: data.department || "All"
    };

    // Start a transaction session for atomicity
    const session2 = await mongoose.startSession();
    session2.startTransaction();

    try {
      // Create the transaction
      const transaction = await Transaction.create([transactionData], { session: session2 });

      // Update bank balance
      const bank = await Bank.findOne({ 
        companyId: companyId, 
        bankName: data.account 
      });

      if (bank) {
        if (data.type === 'income') {
          bank.currentAmount += parseFloat(data.amount);
        } else if (data.type === 'expense') {
          bank.currentAmount -= parseFloat(data.amount);
        }
        await bank.save({ session: session2 });
      }

      await session2.commitTransaction();
      return NextResponse.json(transaction[0], { status: 201 });
    } catch (error) {
      await session2.abortTransaction();
      throw error;
    } finally {
      session2.endSession();
    }
  } catch (error) {
    console.error('Detailed error creating transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to create transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 