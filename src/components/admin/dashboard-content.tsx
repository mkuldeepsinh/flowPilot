"use client"

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { CommandPalette } from "@/components/ui/command-palette"
import { useCommandPalette } from "@/hooks/use-command-palette"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface UserProfile {
  _id: string
  email: string
  name?: string
  role: string
  companyId: string
  companyName: string
  createdAt: string | null
  updatedAt: string | null
  lastLogin: string | null
}

export function DashboardContent({ children, fullUserProfile }: { children: React.ReactNode, fullUserProfile: UserProfile }) {
  const { open, setOpen } = useCommandPalette()

  return (
    <>
      <SidebarProvider
        className="font-sans"
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties}
      >
        <AppSidebar
          variant="inset"
          fullUserProfile={fullUserProfile}
          companyName={fullUserProfile.companyName}
          onSearchClick={() => setOpen(true)}
        />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-white min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  )
} 