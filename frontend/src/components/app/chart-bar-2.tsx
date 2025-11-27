"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", revenue: 400, expenses: 240 },
  { month: "February", revenue: 300, expenses: 221 },
  { month: "March", revenue: 200, expenses: 229 },
  { month: "April", revenue: 278, expenses: 200 },
  { month: "May", revenue: 189, expenses: 221 },
  { month: "June", revenue: 239, expenses: 250 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartBar2() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Revenue vs Expenses</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Revenue trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Comparing revenue and expenses for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
