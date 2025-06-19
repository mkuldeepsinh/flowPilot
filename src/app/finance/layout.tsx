"use client"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [fullUserProfile, setFullUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me")
        const data = await response.json()

        if (response.ok && data.user && data.company) {
          setFullUserProfile({
            ...data.user,
            companyName: data.company.companyName,
          })
        } else {
          console.error("Failed to fetch user data:", data.message)
          if (response.status === 401) {
            router.push("/")
          }
        }
      } catch (error) {
        console.error("Network error fetching user data:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  if (!fullUserProfile) {
    return <div>Error: Could not retrieve user profile. Please log in again.</div>
  }

  return (
    <SidebarProvider
      className="font-sans"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" fullUserProfile={fullUserProfile} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 