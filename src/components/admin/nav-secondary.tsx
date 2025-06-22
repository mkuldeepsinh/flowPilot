"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import { useSidebar } from "@/components/ui/sidebar"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  onSearchClick,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
  onSearchClick?: () => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { toggleSidebar } = useSidebar()

  const handleItemClick = (item: { title: string; url: string; icon: Icon }) => {
    if (item.title === "Search") {
      onSearchClick?.()
    } else if (item.title === "Toggle Sidebar") {
      toggleSidebar()
    }
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {item.title === "Search" || item.title === "Toggle Sidebar" ? (
                  <button 
                    onClick={() => handleItemClick(item)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                    {item.title === "Search" && (
                      <div className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border">
                        <span>⌘</span>
                        <span>K</span>
                      </div>
                    )}
                    {item.title === "Toggle Sidebar" && (
                      <div className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border">
                        <span>⌘</span>
                        <span>B</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <a href={item.url} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </a>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
