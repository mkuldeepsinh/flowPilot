import mongoose from "mongoose";
import Transaction from "@/models/transactionModel";
import { z } from "zod";
import { schema } from "@/components/admin/transaction-table";

type TransactionSchema = z.infer<typeof schema>;

// MOCK_COMPANY and MOCK_USER removed as we now fetch dynamic data

// getCompanyInfo and getUserInfo removed as they returned mock data

export async function getDashboardTransactions(companyId: string) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL!);
    }

    const transactions = await Transaction.find({ companyId: companyId }).lean();
    
    const formattedTransactions: TransactionSchema[] = transactions.map((t: any) => ({
      _id: t._id.toString(),
      date: new Date(t.date).toISOString().split('T')[0],
      description: t.description,
      category: t.category,
      amount: t.amount,
      type: t.type,
      status: t.status,
      account: t.account,
      color: t.color,
      client: t.client,
      vendor: t.vendor,
      invoice: t.invoice,
      department: t.department,
      payment_id: t.payment_id
    }));

    return formattedTransactions;
  } catch (error) {
    console.error('Error fetching dashboard transactions:', error);
    throw error;
  }
}

// You can add more dashboard-related functions here
export async function getDashboardStats(companyId: string) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL!);
    }

    const transactions = await Transaction.find({ companyId }).lean();
    
    const stats = {
      totalRevenue: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      pendingTransactions: transactions
        .filter(t => t.status === 'Pending')
        .length,
      completedTransactions: transactions
        .filter(t => t.status === 'Completed')
        .length
    };

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

// mockCompany and mockUser exports removed as they are no longer needed 