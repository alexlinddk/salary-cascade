"use client";

import { CascadeResult, formatDKK } from "@/lib/cascade";
import { useState } from "react";

export function CascadeBreakdown({ result }: { result: CascadeResult }) {
    const [expandedTier, setExpandedTier] = useState<string | null>(null);
    return (
        <div className="text-left">
            <div>
                {result.totalIncome > 0 && <div className="mb-6 justify-between flex">
                    <p>Indkomst:</p>
                    <p>{formatDKK(result.totalIncome)}</p>
                </div>}
                {result.tierAllocations.map((tier) => (
                    <div key={tier.tierId} className="mb-2">
                        <button
                            onClick={() => setExpandedTier(expandedTier === tier.tierId ? null : tier.tierId)}
                            className="w-full flex justify-between ..."
                        >
                            <span>{tier.tierEmoji} {tier.tierName}</span>
                            <span>-{formatDKK(tier.allocated)}</span>
                        </button>

                        {expandedTier === tier.tierId && (
                            <div className="ml-2">
                                {tier.items.map((item) => (
                                    <div key={item.itemId} className="flex justify-between text-sm text-gray-500">
                                        <span>{item.itemName}</span>
                                        <span>-{formatDKK(item.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {result.savingsAllocated > 0 &&
                    <div className="mb-2 justify-between flex">
                        <p>Opsparing:</p>
                        <p>-{formatDKK(result.savingsAllocated)}</p>
                    </div>}
                {result.investmentsAllocated > 0 &&
                    <div className="mb-6 justify-between flex">
                        <p>Investering:</p>
                        <p>-{formatDKK(result.investmentsAllocated)}</p>
                    </div>}
            </div>
            <hr className="my-4" />
            <div className="mb-6 justify-between flex text-lg font-semibold">
                <p>Frit forbrug:</p>
                <p className="font-semibold text-green-300">{formatDKK(result.freeMoney)}</p>
            </div>
            {result.warnings.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                    <p className="font-semibold">Advarsler:</p>
                    <ul className="list-disc list-inside">
                        {result.warnings.map((warning, idx) => (
                            <li key={idx}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

    );
}