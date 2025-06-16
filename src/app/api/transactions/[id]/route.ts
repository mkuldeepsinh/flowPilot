import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/dbConfing/dbConfing"
import Transaction from "@/models/transactionModel"
import mongoose from 'mongoose'
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()

    const { id: transactionId } = await context.params

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 }
      )
    }

    const token = (await cookies()).get('token')?.value || '';
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    let decodedToken: any;
    try {
      decodedToken = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const companyId = decodedToken.companyId;
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID not found in token' }, { status: 400 });
    }

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(transactionId),
      companyId: companyId
    })

    if (!deletedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Transaction deleted successfully", data: deletedTransaction })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { error: "Failed to delete transaction", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id: transactionId } = await context.params
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 }
      )
    }

    const token = (await cookies()).get('token')?.value || '';
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    let decodedToken: any;
    try {
      decodedToken = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const companyId = decodedToken.companyId;
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID not found in token' }, { status: 400 });
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(transactionId), companyId },
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Transaction updated successfully", data: updatedTransaction })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      { error: "Failed to update transaction", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}