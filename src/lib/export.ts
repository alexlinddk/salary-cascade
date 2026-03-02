"use server";

import { db } from "@/db";
import {
  incomeSources,
  tiers,
  expenses,
  savingsGoals,
  investmentAllocations,
  monthlySnapshots,
  snapshotTierAllocations,
  transferItems,
  spendingEntries,
} from "@/db/schema";

export async function exportData() {
  const data = {
    exportedAt: new Date().toISOString(),
    incomeSources: await db.select().from(incomeSources),
    tiers: await db.select().from(tiers),
    expenses: await db.select().from(expenses),
    savingsGoals: await db.select().from(savingsGoals),
    investmentAllocations: await db.select().from(investmentAllocations),
    monthlySnapshots: await db.select().from(monthlySnapshots),
    snapshotTierAllocations: await db.select().from(snapshotTierAllocations),
    transferItems: await db.select().from(transferItems),
    spendingEntries: await db.select().from(spendingEntries),
  };

  return JSON.stringify(data, null, 2);
}