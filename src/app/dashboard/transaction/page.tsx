import TransactionTable from "@/components/admin/transaction-table";
import { getDashboardTransactions } from "@/lib/dashboard";

export default async function TransactionsPage() {
  const transactions = await getDashboardTransactions();
  
  return (
    <div className="container mx-auto py-6">
      <TransactionTable data={transactions} />
    </div>
  );
}