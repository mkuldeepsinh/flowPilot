"use client"

import { useState, useEffect } from "react"
import TransactionTable from "@/components/admin/transaction-table"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
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
      } catch (err: any) {
        setError("Network error or failed to load transactions: " + err.message)
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