"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type Entry = {
  category: string;
  amount: number;
};

const COLORS: Record<string, string> = {
  "Mad & drikke": "var(--tier-1)",
  Transport: "var(--warning)",
  Underholdning: "var(--free-color)",
  Tøj: "var(--invest-color)",
  Restaurant: "#f472b6",
  Bar: "#fb923c",
  Andet: "var(--muted-foreground)",
};

export function SpendingChart({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) return null;

  const grouped = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const chartConfig = data.reduce<ChartConfig>((acc, d) => {
    acc[d.name] = {
      label: d.name,
      color: COLORS[d.name] || "var(--muted-foreground)",
    };
    return acc;
  }, {});

  return (
    <div className="my-6">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
        Fordeling
      </h2>
      <Card>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48 w-full aspect-auto">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="flex items-center justify-between w-full gap-4">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="tabular-nums font-medium">
                          {Math.round(value as number)} kr.
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] || "var(--muted-foreground)"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {data.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center gap-1.5 text-xs"
              >
                <span
                  className="w-2 h-2 rounded-[2px]"
                  style={{
                    backgroundColor:
                      COLORS[entry.name] || "var(--muted-foreground)",
                  }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
                <span className="tabular-nums text-foreground">
                  {Math.round(entry.value)} kr.
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}