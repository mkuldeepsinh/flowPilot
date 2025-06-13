import mongoose from "mongoose";
import Transaction from "@/models/transactionModel";
import { z } from "zod";
import { schema } from "@/components/admin/transaction-table";

type TransactionSchema = z.infer<typeof schema>;

// Mock data for development
const MOCK_COMPANY = {
  id: "COMP_1749635591705_32zce2bpo",
  name: "Tech Solutions Inc",
  logo: "/images/company-logo.png",
  email: "contact@techsolutions.com",
  address: "123 Tech Street, Silicon Valley, CA",
  phone: "+1 (555) 123-4567"
};

const MOCK_USER = {
  id: "USER_123456",
  name: "John Doe",
  email: "john.doe@techsolutions.com",
  role: "admin",
  avatar: "/images/user-avatar.png",
  department: "Finance"
};

export async function getCompanyInfo(companyId: string) {
  try {
    // TODO: Replace with actual database query
    // For now, return mock data
    return MOCK_COMPANY;
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw error;
  }
}

export async function getUserInfo(userId: string) {
  try {
    // TODO: Replace with actual database query
    // For now, return mock data
    return MOCK_USER;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}

export async function getDashboardTransactions() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL!);
    }

    const transactions = await Transaction.find({ companyId: MOCK_COMPANY['id'] }).lean();
    
    const formattedTransactions: TransactionSchema[] = transactions.map((t: any, index) => ({
      id: index + 1,
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

// Export mock data for direct use if needed
export const mockCompany = MOCK_COMPANY;
export const mockUser = MOCK_USER; 