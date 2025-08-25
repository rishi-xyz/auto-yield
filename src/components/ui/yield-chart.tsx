"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "Jan 1", yield: 1000 },
  { date: "Jan 5", yield: 1050 },
  { date: "Jan 10", yield: 1120 },
  { date: "Jan 15", yield: 1080 },
  { date: "Jan 20", yield: 1150 },
  { date: "Jan 25", yield: 1200 },
  { date: "Jan 30", yield: 1235 },
]

export function YieldChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "white" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "white" }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-lg font-semibold text-primary">${payload[0].value}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="yield"
            stroke="blue"
            strokeWidth={2}
            fill="primary"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
