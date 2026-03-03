"use client";

import { CascadeResult, formatDKK } from "@/lib/cascade";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  tiers: { label: "Udgifter", color: "var(--tier-1)" },
  savings: { label: "Opsparing", color: "var(--savings-color)" },
  investments: { label: "Investering", color: "var(--invest-color)" },
  free: { label: "Frit forbrug", color: "var(--free-color)" },
} satisfies ChartConfig;

export function CascadeBar({ result }: { result: CascadeResult }) {
  if (result.totalIncome <= 0) return null;

  const tierTotal = result.tierAllocations.reduce(
    (sum, t) => sum + t.allocated,
    0
  );

  const segments = [
    { key: "tiers", value: tierTotal },
    { key: "savings", value: result.savingsAllocated },
    { key: "investments", value: result.investmentsAllocated },
    { key: "free", value: Math.max(0, result.freeMoney) },
  ].filter((d) => d.value > 0);

  // Build a single row object with each segment as a key
  const row: Record<string, number> = {};
  segments.forEach((s) => {
    row[s.key] = s.value;
  });

  return (
    <div className="py-4">
      <ChartContainer config={chartConfig} className="h-14 w-full aspect-auto">
        <BarChart
          data={[row]}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <YAxis type="category" hide dataKey={() => ""} />
          <XAxis type="number" hide domain={[0, result.totalIncome]} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => (
                  <div className="flex items-center justify-between w-full gap-4">
                    <span className="text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label}
                    </span>
                    <span className="tabular-nums font-medium">
                      {formatDKK(value as number)}
                    </span>
                  </div>
                )}
              />
            }
          />
          {segments.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              stackId="cascade"
              fill={`var(--color-${s.key})`}
              radius={
                i === 0 && segments.length === 1
                  ? [4, 4, 4, 4]
                  : i === 0
                  ? [4, 0, 0, 4]
                  : i === segments.length - 1
                  ? [0, 4, 4, 0]
                  : [0, 0, 0, 0]
              }
            />
          ))}
        </BarChart>
      </ChartContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {segments.map((d) => {
          const pct = Math.round((d.value / result.totalIncome) * 100);
          return (
            <div key={d.key} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2 h-2 rounded-[2px]"
                style={{
                  backgroundColor:
                    chartConfig[d.key as keyof typeof chartConfig]?.color,
                }}
              />
              <span className="text-muted-foreground">
                {chartConfig[d.key as keyof typeof chartConfig]?.label}
              </span>
              <span className="tabular-nums text-foreground">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}