"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart showing monthly profit and cost"

const monthlyData = [
  // 2023 Data
  { date: "2023-01-01", profit: 150, cost: 80 },
  { date: "2023-02-01", profit: 370, cost: 90 },
  { date: "2023-03-01", profit: 190, cost: 100 },
  { date: "2023-04-01", profit: 210, cost: 110 },
  { date: "2023-05-01", profit: 230, cost: 420 },
  { date: "2023-06-01", profit: 450, cost: 130 },
  { date: "2023-07-01", profit: 270, cost: 140 },
  { date: "2023-08-01", profit: 290, cost: 150 },
  { date: "2023-09-01", profit: 310, cost: 160 },
  { date: "2023-10-01", profit: 730, cost: 170 },
  { date: "2023-11-01", profit: 350, cost: 480 },
  { date: "2023-12-01", profit: 370, cost: 190 },
  // 2024 Data
  { date: "2024-01-01", profit: 220, cost: 120 },
  { date: "2024-02-01", profit: 240, cost: 230 },
  { date: "2024-03-01", profit: 200, cost: 110 },
  { date: "2024-04-01", profit: 480, cost: 150 },
  { date: "2024-05-01", profit: 300, cost: 160 },
  { date: "2024-06-01", profit: 320, cost: 170 },
  { date: "2024-07-01", profit: 290, cost: 240 },
  { date: "2024-08-01", profit: 450, cost: 180 },
  { date: "2024-09-01", profit: 370, cost: 190 },
  { date: "2024-10-01", profit: 390, cost: 300 },
  { date: "2024-11-01", profit: 410, cost: 210 },
  { date: "2024-12-01", profit: 430, cost: 220 },
  // 2025 Data
  { date: "2025-01-01", profit: 500, cost: 180 },
  { date: "2025-02-01", profit: 220, cost: 190 },
  { date: "2025-03-01", profit: 340, cost: 400 },
  { date: "2025-04-01", profit: 460, cost: 210 },
  { date: "2025-05-01", profit: 380, cost: 220 },
  { date: "2025-06-01", profit: 400, cost: 230 },
  // Add more months for 2025 as needed
];

const chartConfig = {
  profit: {
    label: "Profit",
    color: "#10B981", // green
  },
  cost: {
    label: "Cost",
    color: "#EF4444", // red
  },
} satisfies ChartConfig

const currentYear = new Date().getFullYear();
const previousYear1 = currentYear - 1;
const previousYear2 = currentYear - 2;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("currentYear")

  // Removed useEffect for isMobile as yearly filters are less granular

  const filteredData = monthlyData.filter((item) => {
    const date = new Date(item.date)
    const year = date.getFullYear()
    if (timeRange === "currentYear") {
      return year === currentYear
    }
    if (timeRange === "previousYear1") {
      return year === previousYear1
    }
    if (timeRange === "previousYear2") {
      return year === previousYear2
    }
    return false;
  })

  const getCardDescription = () => {
    if (timeRange === "currentYear") {
      return `Showing data for Current Year (${currentYear})`
    }
    if (timeRange === "previousYear1") {
      return `Showing data for Previous Year (${previousYear1})`
    }
    if (timeRange === "previousYear2") {
      return `Showing data for Previous Year (${previousYear2})`
    }
    return "Monthly Profit and Cost Data"
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Profit & Cost Analysis</CardTitle>
        <CardDescription>
          {getCardDescription()}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="currentYear">Current Year</ToggleGroupItem>
            <ToggleGroupItem value="previousYear1">Previous Year 1</ToggleGroupItem>
            <ToggleGroupItem value="previousYear2">Previous Year 2</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-48 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="currentYear" className="rounded-lg">
                Current Year ({currentYear})
              </SelectItem>
              <SelectItem value="previousYear1" className="rounded-lg">
                Previous Year ({previousYear1})
              </SelectItem>
              <SelectItem value="previousYear2" className="rounded-lg">
                Previous Year ({previousYear2})
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.profit.color}
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.profit.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCost" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.cost.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.cost.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={5} // Adjusted for monthly view
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : filteredData.length > 1 ? 1 : 0} // Adjust default index
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric", // Show year in tooltip
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="cost"
              type="natural"
              fill="url(#fillCost)"
              stroke={chartConfig.cost.color}
              stackId="a"
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillProfit)"
              stroke={chartConfig.profit.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
