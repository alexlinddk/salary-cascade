"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Entry = {
  category: string;
  amount: number;
};

const COLORS: Record<string, string> = {
  "Mad & drikke": "#f87171",
  "Transport": "#fbbf24",
  "Underholdning": "#a78bfa",
  "Tøj": "#60a5fa",
  "Restaurant": "#f472b6",
  "Bar": "#fb923c",
  "Andet": "#6b7280",
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

  return (
    <div className="mb-6 mt-6">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
        Fordeling
      </h2>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] || "#6b7280"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[entry.name] || "#6b7280" }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="tabular-nums text-foreground">
                {Math.round(entry.value)} kr.
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}