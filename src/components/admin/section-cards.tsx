import type React from "react" // Added import
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { ArrowDownRight, ArrowUpRight, DollarSign, Users, CreditCard, Briefcase } from "lucide-react" // Added Briefcase icon

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils" // Added cn import

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
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-md border-transparent", styles.bgLight, className)}> {/* Removed styles.border and added border-transparent */}
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
  const cardsData: MetricCardProps[] = [ // Updated data structure
    {
      title: "Total Revenue",
      value: "$1,250.00",
      change: "+12.5%",
      trend: "up",
      description: "Trending up this month",
      subtext: "Visitors for the last 6 months",
      icon: <DollarSign className="h-4 w-4" />,
      color: "emerald",
    },
    {
      title: "Total Bank Balance", // Changed title
      value: "$5,750,000.00", // Placeholder value
      change: "-0.2%", // Placeholder change
      trend: "down", // Placeholder trend
      description: "Overall bank liquidity", // Placeholder description
      subtext: "Across all operational accounts", // Placeholder subtext
      icon: <DollarSign className="h-4 w-4" />,
      color: "rose", // Changed color to rose for negative trend
    },
    {
      title: "Active Projects", // Changed title
      value: "12", // Placeholder value
      change: "+3", // Placeholder change (e.g., new projects this month)
      trend: "up",
      description: "Ongoing initiatives and tasks", // Changed description
      subtext: "Tracking progress and milestones", // Changed subtext
      icon: <Briefcase className="h-4 w-4" />, // Changed icon
      color: "blue",
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      change: "+4.5%",
      trend: "up",
      description: "Steady performance increase",
      subtext: "Meets growth projections",
      icon: <IconTrendingUp className="h-4 w-4" />, // Using Tabler icon as per example
      color: "violet",
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {cardsData.map((card) => (
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
      ))}
    </div>
  )
}
