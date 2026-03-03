"use server";

import { db } from "@/db";
import { expenses, incomeSources, investmentAllocations, monthlySnapshots, savingsGoals, snapshotTierAllocations, spendingEntries, tiers, transferItems } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cascade } from "./cascade";
import { getCascadeData } from "./data";
import { redirect } from "next/navigation";


export async function addIncomeSource(name: string, expectedAmount: string, payDay: number) {
    await db.insert(incomeSources).values({
        name,
        expectedAmount,
        payDay,
        isRecurring: true,
    });
    revalidatePath("/income");
    revalidatePath("/overview");
}

export async function updateIncomeSource(id: string, name: string, expectedAmount: string, payDay: number) {
    await db.update(incomeSources).set({
        name,
        expectedAmount,
        payDay,
        updatedAt: new Date(),
    }).where(eq(incomeSources.id, id));
    revalidatePath("/income");
    revalidatePath("/overview");
}

export async function deleteIncomeSource(id: string) {
    await db.delete(incomeSources).where(eq(incomeSources.id, id));
    revalidatePath("/income");
    revalidatePath("/overview");
}

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
  currentAmount: string,
  monthlyContribution: string,
  priority: number
) {
  await db.insert(savingsGoals).values({
    name,
    targetAmount,
    currentAmount,
    monthlyContribution,
    priority,
  });
  revalidatePath("/savings");
  revalidatePath("/overview");
}

export async function updateSavingsGoal(
    id: string,
    name: string,
    targetAmount: string,
    monthlyContribution: string,
    priority: number
) {
    await db.update(savingsGoals).set({
        name,
        targetAmount,
        monthlyContribution,
        priority,
        updatedAt: new Date(),
    }).where(eq(savingsGoals.id, id));
    revalidatePath("/savings");
    revalidatePath("/overview");
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

export async function confirmIncome(month: string, actualIncome: string) {
    const existing = await db.query.monthlySnapshots.findFirst({
        where: eq(monthlySnapshots.month, month),
    });

    if (existing) {
        redirect("/transfers");
    }

    const data = await getCascadeData();

    const totalIncome = parseFloat(actualIncome);

    const cascadeTiers = data.tiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        priority: tier.priority,
        items: tier.expenses.map((exp) => ({
            id: exp.id,
            name: exp.name,
            amount: parseFloat(exp.amount),
        })),
    }));

    const cascadeSavings = data.savings.map((goal) => ({
        id: goal.id,
        name: goal.name,
        monthlyContribution: parseFloat(goal.monthlyContribution),
        priority: goal.priority,
        targetAmount: parseFloat(goal.targetAmount),
        currentAmount: parseFloat(goal.currentAmount),
    }));

    const cascadeInvestments = data.investments.map((inv) => ({
        id: inv.id,
        name: inv.name,
        allocationType: inv.allocationType,
        amount: parseFloat(inv.amount),
    }));
    const result = cascade(totalIncome, cascadeTiers, cascadeSavings, cascadeInvestments);
    const [snapshot] = await db.insert(monthlySnapshots).values({
        month,
        totalIncome: actualIncome,
        savingsAllocated: String(result.savingsAllocated),
        investmentsAllocated: String(result.investmentsAllocated),
        freeMoney: String(result.freeMoney),
        isConfirmed: true,
        confirmedAt: new Date(),
    }).returning();

    for (const tier of result.tierAllocations) {
        await db.insert(snapshotTierAllocations).values({
            snapshotId: snapshot.id,
            tierId: tier.tierId,
            tierName: tier.tierName,
            requested: String(tier.requested),
            allocated: String(tier.allocated),
            fullyFunded: tier.fullyFunded,
            shortfall: String(tier.shortfall),
        });
    }

    for (const tier of result.tierAllocations) {
        for (const item of tier.items) {
            if (item.amount > 0) {
                const originalExpense = data.tiers
                    .flatMap(t => t.expenses)
                    .find(e => e.id === item.itemId);

                await db.insert(transferItems).values({
                    snapshotId: snapshot.id,
                    name: item.itemName,
                    amount: String(item.amount),
                    type: originalExpense?.isAutoPaid ? "auto" : "manual",
                });
            }
        }
    }

    for (const goal of result.savingsDetails) {
        if (goal.allocated > 0) {
            await db.insert(transferItems).values({
                snapshotId: snapshot.id,
                name: `Opsparing: ${goal.goalName}`,
                amount: String(goal.allocated),
                type: "manual",
            });
        }
    }

    for (const inv of result.investmentDetails) {
        if (inv.allocated > 0) {
            await db.insert(transferItems).values({
                snapshotId: snapshot.id,
                name: `Investering: ${inv.investmentName}`,
                amount: String(inv.allocated),
                type: "manual",
            });
        }
    }


    revalidatePath("/overview");
    redirect("/transfers");
}

export async function toggleTransferItem(id: string, completed: boolean) {
    await db.update(transferItems).set({
        isCompleted: completed,
        completedAt: completed ? new Date() : null,
    }).where(eq(transferItems.id, id));
    revalidatePath("/transfers");
}

export async function addSpendingEntry(
    snapshotId: string,
    description: string,
    amount: string,
    category: string
) {
    await db.insert(spendingEntries).values({
        snapshotId,
        description,
        amount,
        date: new Date(),
        category,
    });

    const entries = await db.select().from(spendingEntries)
        .where(eq(spendingEntries.snapshotId, snapshotId));

    const totalSpent = entries.reduce(
        (sum, e) => sum + parseFloat(e.amount), 0
    );

    await db.update(monthlySnapshots).set({
        freeMoneySpent: String(totalSpent),
    }).where(eq(monthlySnapshots.id, snapshotId));

    revalidatePath("/spending");
}