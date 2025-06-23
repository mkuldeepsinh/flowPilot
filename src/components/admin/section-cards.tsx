import type React from "react"
import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { ArrowDownRight, ArrowUpRight, DollarSign, Briefcase } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Added MetricCardProps interface
interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  subtext: string
  icon: React.ReactNode
  color: "emerald" | "rose" | "blue" | "violet" | "amber"
  className?: string
}

// Added colorStyles object
const colorStyles = {
  emerald: {
    bgLight: "bg-white dark:bg-slate-950", // Changed to white background
    bgDark: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400",
    gradient: "from-emerald-50/30 to-transparent dark:from-emerald-950/20 dark:to-transparent", // Adjusted gradient opacity
  },
  rose: {
    bgLight: "bg-white dark:bg-slate-950", // Changed to white background
    bgDark: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400",
    gradient: "from-rose-50/30 to-transparent dark:from-rose-950/20 dark:to-transparent", // Adjusted gradient opacity
  },
  blue: {
    bgLight: "bg-white dark:bg-slate-950", // Changed to white background
    bgDark: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400",
    gradient: "from-blue-50/30 to-transparent dark:from-blue-950/20 dark:to-transparent", // Adjusted gradient opacity
  },
  violet: {
    bgLight: "bg-white dark:bg-slate-950", // Changed to white background
    bgDark: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400",
    gradient: "from-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent", // Adjusted gradient opacity
  },
  amber: { // Added amber for completeness, though not used in the 4 cards
    bgLight: "bg-white dark:bg-slate-950", // Changed to white background
    bgDark: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400",
    gradient: "from-amber-50/30 to-transparent dark:from-amber-950/20 dark:to-transparent", // Adjusted gradient opacity
  },
}

// Added MetricCard component
function MetricCard({ title, value, change, trend, description, subtext, icon, color, className }: MetricCardProps) {
  const styles = colorStyles[color]

  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-md border-transparent pb-8", styles.bgLight, className)}> {/* Added extra bottom padding */}
      <div className={cn("absolute inset-0 opacity-50 bg-gradient-to-br", styles.gradient)} /> {/* Adjusted opacity for gradient */}
      <CardHeader className="pb-2 relative z-10"> {/* Added relative z-10 */}
        <div className="flex items-center justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", styles.icon)}>{icon}</div>
          <Badge
            variant="outline"
            className={cn(
              "font-medium border", // Added border class for default outline variant
              trend === "up"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
            )}
            {change}
          </Badge>
        </div>
        <CardDescription className="pt-3">{title}</CardDescription>
        <CardTitle className="text-3xl font-bold tracking-tight">{value}</CardTitle>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1.5 pt-0 relative z-10"> {/* Added relative z-10 */}
        <div
          className={cn(
            "flex items-center gap-1 font-medium",
            trend === "up" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400",
          )}
        >
          {description}
          {trend === "up" ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" />}
        </div>
        <div className="text-sm text-muted-foreground">{subtext}</div>
      </CardFooter>
    </Card>
  )
}


export function SectionCards() {
  const [bankBalance, setBankBalance] = useState<number | null>(null)
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null)
  const [growthRate, setGrowthRate] = useState<{rate: number|null, trend: 'up'|'down', change: string}>({rate: null, trend: 'up', change: ''})
  const [loading, setLoading] = useState(true)
  const [activeProjectsCount, setActiveProjectsCount] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [banksRes, transactionsRes, projectsRes] = await Promise.all([
          fetch("/api/banks"),
          fetch("/api/transactions"),
          fetch("/api/projects")
        ])
        const banks = await banksRes.json()
        const transactions = await transactionsRes.json()
        const projects = await projectsRes.json()
        const totalBank = Array.isArray(banks) ? banks.reduce((sum, b) => sum + (b.currentAmount || 0), 0) : 0
        const totalRev = Array.isArray(transactions) ? transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + (t.amount || 0), 0) : 0
        setBankBalance(totalBank)
        setTotalRevenue(totalRev)

        // Calculate growth rate (month-over-month revenue growth)
        const now = new Date()
        const thisMonth = now.getMonth()
        const thisYear = now.getFullYear()
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear
        const thisMonthRevenue = transactions.filter((t: { type: string; date: string }) => t.type === "income" && new Date(t.date).getMonth() === thisMonth && new Date(t.date).getFullYear() === thisYear).reduce((sum: number, t: { amount?: number }) => sum + (t.amount || 0), 0)
        const lastMonthRevenue = transactions.filter((t: { type: string; date: string }) => t.type === "income" && new Date(t.date).getMonth() === lastMonth && new Date(t.date).getFullYear() === lastMonthYear).reduce((sum: number, t: { amount?: number }) => sum + (t.amount || 0), 0)
        let rate: number|null = null
        let trend: 'up'|'down' = 'up'
        let change = ''
        if (lastMonthRevenue > 0) {
          rate = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          trend = rate >= 0 ? 'up' : 'down'
          change = (rate >= 0 ? '+' : '') + rate.toFixed(1) + '%'
        } else if (thisMonthRevenue > 0) {
          rate = 100
          trend = 'up'
          change = '+100%'
        } else {
          rate = 0
          trend = 'down'
          change = '0%'
        }
        setGrowthRate({rate, trend, change})

        // Active projects: not archived
        const activeProjects = Array.isArray(projects) ? projects.filter((p: { isArchived?: boolean }) => !p.isArchived) : []
        setActiveProjectsCount(activeProjects.length)
      } catch {
        setBankBalance(null)
        setTotalRevenue(null)
        setGrowthRate({rate: null, trend: 'up', change: ''})
        setActiveProjectsCount(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "--"
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const cardsData: MetricCardProps[] = [
    {
      title: "Total Revenue",
      value: loading ? "--" : formatCurrency(totalRevenue),
      change: "",
      trend: "up",
      description: "Total income from all transactions",
      subtext: "Sum of all completed income transactions",
      icon: <DollarSign className="h-4 w-4" />,
      color: "emerald",
    },
    {
      title: "Total Bank Balance",
      value: loading ? "--" : formatCurrency(bankBalance),
      change: "",
      trend: "up",
      description: "Sum of all bank accounts",
      subtext: "Current balance across all banks",
      icon: <DollarSign className="h-4 w-4" />,
      color: "rose",
    },
    {
      title: "Active Projects",
      value: loading ? "--" : (activeProjectsCount !== null ? activeProjectsCount.toString() : "--"),
      change: "",
      trend: "up",
      description: "Ongoing initiatives and tasks",
      subtext: "Tracking progress and milestones",
      icon: <Briefcase className="h-4 w-4" />,
      color: "blue",
    },
    {
      title: "Growth Rate",
      value: loading ? "--" : (growthRate.rate !== null ? growthRate.change : '--'),
      change: loading ? "" : (growthRate.rate !== null ? growthRate.change : ''),
      trend: growthRate.trend,
      description: "Month-over-month revenue growth",
      subtext: "Compared to previous month",
      icon: <IconTrendingUp className="h-4 w-4" />,
      color: "violet",
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {cardsData.map((card) => {
        if (card.title === "Active Projects") {
          return (
            <Link href="/projects" key={card.title} className="contents">
              <MetricCard
                title={card.title}
                value={card.value}
                change={card.change}
                trend={card.trend}
                description={card.description}
                subtext={card.subtext}
                icon={card.icon}
                color={card.color}
              />
            </Link>
          );
        }
        return (
          <MetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            change={card.change}
            trend={card.trend}
            description={card.description}
            subtext={card.subtext}
            icon={card.icon}
            color={card.color}
          />
        );
      })}
    </div>
  )
}
