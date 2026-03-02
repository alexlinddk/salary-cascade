"use client";

import { CascadeResult, formatDKK } from "@/lib/cascade";
import { useState } from "react";

const SEGMENTS = [
    { key: "tiers", label: "Udgifter", color: "var(--tier-1)" },
    { key: "savings", label: "Opsparing", color: "var(--savings-color)" },
    { key: "investments", label: "Investering", color: "var(--invest-color)" },
    { key: "free", label: "Frit forbrug", color: "var(--free-color)" },
];

export function CascadeBar({ result }: { result: CascadeResult }) {
    const [hovered, setHovered] = useState<string | null>(null);

    if (result.totalIncome <= 0) return null;

    const tierTotal = result.tierAllocations.reduce(
        (sum, t) => sum + t.allocated,
        0
    );

    const values: Record<string, number> = {
        tiers: tierTotal,
        savings: result.savingsAllocated,
        investments: result.investmentsAllocated,
        free: Math.max(0, result.freeMoney),
    };

    return (
        <div className="py-4">
            {/* Bar */}
            <div className="w-full h-8 rounded-lg overflow-hidden flex">
                {SEGMENTS.map((seg) => {
                    const pct = (values[seg.key] / result.totalIncome) * 100;
                    if (pct <= 0) return null;
                    return (
                        <div
                            key={seg.key}
                            className="h-full transition-opacity duration-200"
                            style={{
                                width: `${pct}%`,
                                backgroundColor: seg.color,
                                opacity: hovered && hovered !== seg.key ? 0.3 : 1,
                            }}
                            onMouseEnter={() => setHovered(seg.key)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {SEGMENTS.map((seg) => {
                    const value = values[seg.key];
                    if (value <= 0) return null;
                    const pct = Math.round((value / result.totalIncome) * 100);
                    return (
                        <div
                            key={seg.key}
                            className={`flex items-center gap-1.5 text-xs transition-opacity duration-200 ${hovered && hovered !== seg.key
                                    ? "opacity-30"
                                    : "opacity-100"
                                }`}
                            onMouseEnter={() => setHovered(seg.key)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: seg.color }}
                            />
                            <span className="text-muted-foreground">{seg.label}</span>
                            <span className="tabular-nums text-foreground">
                                {pct}%
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Hover detail */}
            <p className="text-sm text-muted-foreground mt-2 tabular-nums h-5">
                {hovered && (
                    <>
                        {SEGMENTS.find((s) => s.key === hovered)?.label}:{" "}
                        <span className="text-foreground">
                            {formatDKK(values[hovered])}
                        </span>
                    </>
                )}
            </p>
        </div>
    );
}