"use server";

import { db } from "@/db";
import { expenses, investmentAllocations, savingsGoals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addExpense(tierId: string, name: string, amount: string) {
    await db.insert(expenses).values({
        tierId,
        name,
        amount,
        isFixed: true,
        category: "Uncategorized",
        dueDate: null,
        isAutoPaid: false,
        notes: "",
    });
    revalidatePath("/tiers");
}

export async function updateExpense(id: string, name: string, amount: string) {
    await db.update(expenses).set({
        name,
        amount,
        updatedAt: new Date(),
    }).where(eq(expenses.id, id));
    revalidatePath("/tiers");
}

export async function deleteExpense(id: string) {
    await db.delete(expenses).where(eq(expenses.id, id));
    revalidatePath("/tiers");
}

export async function addSavingsGoal(
    name: string,
    targetAmount: string,
    monthlyContribution: string,
    priority: number) {
    await db.insert(savingsGoals).values({
        name,
        targetAmount: targetAmount,
        monthlyContribution: monthlyContribution,
        priority,
    });
    revalidatePath("/savings");
}

export async function deleteSavingsGoal(id: string) {
    await db.delete(savingsGoals).where(eq(savingsGoals.id, id));
    revalidatePath("/savings");
}

export async function addInvestmentAllocation(name: string, allocationType: "fixed" | "percentage", amount: string) {
    await db.insert(investmentAllocations).values({
        name,
        allocationType,
        amount,
    });
    revalidatePath("/investments");
}

export async function deleteInvestmentAllocation(id: string) {
    await db.delete(investmentAllocations).where(eq(investmentAllocations.id, id));
    revalidatePath("/investments");
}