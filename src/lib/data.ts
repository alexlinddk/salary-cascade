import { db } from "@/db";
import { incomeSources, tiers, expenses, savingsGoals, investmentAllocations } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getCascadeData() {
  const income = await db.query.incomeSources.findMany();

  const allTiers = await db.query.tiers.findMany({
    with: { expenses: true },
    orderBy: [asc(tiers.priority)],
  });

  const savings = await db.query.savingsGoals.findMany({
    orderBy: [asc(savingsGoals.priority)],
  });

  const investments = await db.query.investmentAllocations.findMany();

  return { income, tiers: allTiers, savings, investments };
}

export async function getTiersWithExpenses() {
  return db.query.tiers.findMany({
    with: { expenses: true },
    orderBy: [asc(tiers.priority)],
  });
}

export async function getSavingsGoals() {
  return db.query.savingsGoals.findMany({
    orderBy: [asc(savingsGoals.priority)],
  });
}

export async function getInvestmentAllocations() {
  return db.query.investmentAllocations.findMany();
}