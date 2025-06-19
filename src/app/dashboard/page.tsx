"use client"

import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { DataTable } from "@/components/admin/data-table"
import { SectionCards } from "@/components/admin/section-cards"
import { useState, useEffect } from "react"

// import data from "./data.json" // No longer needed as we'll fetch dynamic data

export default function Page() {
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    console.log('Dashboard Page: Starting fetch for company ID');
    const fetchCompanyId = async () => {
      try {
        const response = await fetch("/api/user/me")
        console.log('Dashboard Page: API response status:', response.status);
        const data = await response.json()
        console.log('Dashboard Page: API response data:', data);

        if (response.ok && data.user && data.user.companyId) {
          setCompanyId(data.user.companyId)
          console.log('Dashboard Page: Company ID set to:', data.user.companyId);
        } else {
          console.error("Dashboard Page: Failed to fetch user data:", data.message)
        }
      } catch (error) {
        console.error("Dashboard Page: Network error fetching user data:", error)
      } finally {
        setLoading(false)
        console.log('Dashboard Page: Loading state set to false');
      }
    }

    fetchCompanyId()
  }, [])

  if (loading) {
    console.log('Dashboard Page: Displaying loading state');
    return <div>Loading dashboard data...</div> // Or a proper loading spinner
  }

  if (!companyId) {
    console.log('Dashboard Page: Company ID not found, displaying error');
    return <div>Error: Could not retrieve company ID. Please log in again.</div>
  }

  console.log('Dashboard Page: Rendering ChartAreaInteractive with companyId:', companyId);
  return (
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive companyId={companyId} />
              </div>
              {/* <DataTable data={data} /> */}
            </div>
          </div>
  )
}
