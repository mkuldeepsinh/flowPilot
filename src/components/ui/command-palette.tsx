"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  IconSearch,
  IconPlus,
  IconFileText,
  IconFolder,
  IconUsers,
  IconCreditCard,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ElementType
  action: () => void
  category: string
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const commands: CommandItem[] = [
    {
      id: "new-transaction",
      title: "Add Transaction",
      description: "Create a new financial transaction",
      icon: IconPlus,
      action: () => router.push("/dashboard/transaction"),
      category: "Create"
    },
    {
      id: "new-bank",
      title: "Add Bank Account",
      description: "Register a new bank account",
      icon: IconCreditCard,
      action: () => router.push("/dashboard/banks"),
      category: "Create"
    },
    {
      id: "new-project",
      title: "New Project",
      description: "Start a new project",
      icon: IconFolder,
      action: () => router.push("/projects/create"),
      category: "Create"
    },
    {
      id: "invite-employee",
      title: "Invite Employee",
      description: "Send an employee invitation",
      icon: IconUsers,
      action: () => router.push("/dashboard/employees"),
      category: "Create"
    },
    {
      id: "view-dashboard",
      title: "Dashboard",
      description: "Go to main dashboard",
      icon: IconChartBar,
      action: () => router.push("/dashboard"),
      category: "Navigate"
    },
    {
      id: "view-transactions",
      title: "View Transactions",
      description: "See all transactions",
      icon: IconFileText,
      action: () => router.push("/dashboard/transaction"),
      category: "Navigate"
    },
    {
      id: "view-banks",
      title: "Bank Accounts",
      description: "Manage bank accounts",
      icon: IconCreditCard,
      action: () => router.push("/dashboard/banks"),
      category: "Navigate"
    },
    {
      id: "view-projects",
      title: "View Projects",
      description: "See all projects",
      icon: IconFolder,
      action: () => router.push("/projects"),
      category: "Navigate"
    },
    {
      id: "settings",
      title: "Settings",
      description: "Application settings",
      icon: IconSettings,
      action: () => router.push("/settings"),
      category: "Settings"
    },
  ]

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(search.toLowerCase()) ||
    (command.description && command.description.toLowerCase().includes(search.toLowerCase()))
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
        onOpenChange(false)
        setSearch("")
        setSelectedIndex(0)
      }
    } else if (e.key === "Escape") {
      onOpenChange(false)
      setSearch("")
      setSelectedIndex(0)
    }
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (!open) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 max-w-xl bg-white border-gray-200 shadow-xl [&>*]:animate-none [&]:animate-none data-[state=open]:animate-none data-[state=closed]:animate-none duration-0 transition-none [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-200">
            <IconSearch className="h-4 w-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to do?"
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
              autoFocus
            />
            <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
              <span>ESC</span>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No results found for &quot;{search}&quot;
              </div>
            ) : (
              <div className="py-1">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => {
                      command.action()
                      onOpenChange(false)
                      setSearch("")
                      setSelectedIndex(0)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-blue-50 text-blue-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${
                      index === selectedIndex
                        ? "bg-blue-100 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    }`}>
                      <command.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{command.title}</div>
                      {command.description && (
                        <div className="text-xs text-gray-500">{command.description}</div>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <div className="text-xs text-gray-400">↵</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 