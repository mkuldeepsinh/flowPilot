"use client"

import { useState, useEffect } from "react"
import TransactionTable from "@/components/admin/transaction-table"

interface Transaction {
  _id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "Completed" | "Pending";
  account: string;
  color: string;
  client?: string;
  vendor?: string;
  invoice?: string;
  department?: string;
  payment_id?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions from the API route
        const response = await fetch("/api/transactions")
        const data = await response.json()

        if (response.ok) {
          setTransactions(data)
        } else {
          setError(data.message || "Failed to fetch transactions.")
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError("Network error or failed to load transactions: " + errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // No need for companyId in dependency array here, as the API uses the token

  if (loading) {
    return <div className="container mx-auto py-6">Loading transactions...</div>
  }

  if (error) {
    return <div className="container mx-auto py-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto py-6">
      <TransactionTable data={transactions} />
    </div>
  )
}