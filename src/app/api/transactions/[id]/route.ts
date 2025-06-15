import { NextResponse } from "next/server"
import dbConnect from "@/dbConfing/dbConfing"
import Transaction from "@/models/transactionModel"
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
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

    // TODO: Get companyId from session/auth
    const companyId = "COMP_1749635591705_32zce2bpo" // Temporary mock company ID

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
  request: Request,
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

    // TODO: Get companyId from session/auth
    const companyId = "COMP_1749635591705_32zce2bpo" // Temporary mock company ID

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