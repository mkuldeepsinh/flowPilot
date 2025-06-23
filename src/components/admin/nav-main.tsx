"use client"

import { type Icon } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} onClick={() => router.push(item.url)} className="modern-sidebar-btn">
                {item.icon && <item.icon className="modern-sidebar-icon" />}
                <span className="modern-sidebar-label">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

<style jsx global>{`
  .modern-sidebar-btn {
    @apply flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-base text-blue-900 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 shadow-sm;
  }
  .modern-sidebar-icon {
    @apply w-6 h-6 text-indigo-600;
  }
  .modern-sidebar-label {
    @apply text-lg font-semibold tracking-wide;
  }
`}</style>
