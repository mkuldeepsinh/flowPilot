import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Transaction from "@/models/transactionModel";
import { mockCompany } from "@/lib/dashboard";

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

export async function GET() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL!);
    }

    const transactions = await Transaction.find().lean();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received transaction creation request');

    // Check MongoDB connection
    if (mongoose.connection.readyState === 0) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGO_URL!);
      console.log('Connected to MongoDB');
    }

    const data = await request.json();
    console.log('Received data:', data);
    
    // Add companyId and default values
    const transactionData = {
      ...data,
      companyId: mockCompany.id,
      date: new Date(data.date),
      amount: parseFloat(data.amount),
      // Set color based on category
      color: categoryColors[data.category] || "#6B7280", // Default gray if category not found
      // Set department to "All" if not provided
      department: data.department || "All"
    };

    console.log('Creating transaction with data:', transactionData);

    const transaction = await Transaction.create(transactionData);
    console.log('Transaction created successfully:', transaction);
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Detailed error creating transaction:', error);
    
    // Return more detailed error information
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