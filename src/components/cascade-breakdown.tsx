"use client";

import { CascadeResult, formatDKK } from "@/lib/cascade";
import { useState } from "react";

const TIER_COLORS: Record<number, string> = {
  0: "bg-tier1",
  1: "bg-tier2",
};

export function CascadeBreakdown({ result }: { result: CascadeResult }) {
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  return (
    <div className="space-y-1 py-4">
      {/* Income */}
      {result.totalIncome > 0 && (
        <div className="flex justify-between py-2 text-muted-foreground">
          <span>Indkomst</span>
          <span className="tabular-nums font-medium text-foreground">
            {formatDKK(result.totalIncome)}
          </span>
        </div>
      )}

      {/* Tier allocations */}
      {result.tierAllocations.map((tier, idx) => (
        <div key={tier.tierId}>
          <button
            onClick={() =>
              setExpandedTier(
                expandedTier === tier.tierId ? null : tier.tierId
              )
            }
            className="w-full flex justify-between items-center py-2 hover:bg-accent/50 rounded px-1 -mx-1 transition-colors"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  TIER_COLORS[idx] || "bg-muted-foreground"
                }`}
              />
              {tier.tierEmoji} {tier.tierName}
              {!tier.fullyFunded && (
                <span className="text-xs text-warning">⚠</span>
              )}
            </span>
            <span className="tabular-nums text-foreground">
              -{formatDKK(tier.allocated)}
            </span>
          </button>

          {expandedTier === tier.tierId && (
            <div className="ml-6 mb-2 space-y-0.5">
              {tier.items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between text-sm text-muted-foreground py-0.5"
                >
                  <span>{item.itemName}</span>
                  <span className="tabular-nums">
                    -{formatDKK(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Savings */}
      {result.savingsAllocated > 0 && (
        <div className="flex justify-between py-2 text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-savings" />
            🟢 Opsparing
          </span>
          <span className="tabular-nums text-foreground">
            -{formatDKK(result.savingsAllocated)}
          </span>
        </div>
      )}

      {/* Investments */}
      {result.investmentsAllocated > 0 && (
        <div className="flex justify-between py-2 text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-invest" />
            🔵 Investering
          </span>
          <span className="tabular-nums text-foreground">
            -{formatDKK(result.investmentsAllocated)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-border my-2" />
      <div className="flex justify-between py-2">
        <span className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-free" />
          Frit forbrug
        </span>
        <span className="tabular-nums font-semibold text-free">
          {formatDKK(result.freeMoney)}
        </span>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-warning text-sm font-medium mb-1">Advarsler</p>
          {result.warnings.map((warning, idx) => (
            <p key={idx} className="text-sm text-warning/80">
              {warning}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}