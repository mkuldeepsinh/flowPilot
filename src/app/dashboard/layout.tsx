import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" 
import dbConnect from "@/dbConfing/dbConfing" 
import User from "@/models/userModel"
import Company from "@/models/companyModel"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. Get session
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return <div>Error: Not authenticated</div>
  }

  // 2. Connect to DB and fetch user
  await dbConnect()
  const user = await User.findOne({ email: session.user.email }).lean()

  // Debug: log user
  if (!user) {
    console.error("User not found for email:", session.user.email)
    return <div>Error: Could not retrieve user profile. Please log in again.</div>
  }
  if (!user.companyId) {
    console.error("companyId missing on user:", user)
    return <div>Error: Could not retrieve company ID. Please log in again.</div>
  }

  // 3. Fetch company using companyId (string, not ObjectId)
  const company = await Company.findOne({ companyId: user.companyId }).lean()
  if (!company) {
    console.error("Company not found for companyId:", user.companyId)
    return <div>Error: Could not retrieve company info. Please log in again.</div>
  }

  // 4. Serialize user and company for client components
  const fullUserProfile = {
    ...user,
    _id: user._id?.toString?.() ?? "",
    companyId: user.companyId,
    companyName: company.companyName,
    createdAt: user.createdAt?.toISOString?.() ?? null,
    updatedAt: user.updatedAt?.toISOString?.() ?? null,
    lastLogin: user.lastLogin?.toISOString?.() ?? null,
  }

  return (
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
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}