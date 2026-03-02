"use server";

import { db } from "@/db";
import { expenses } from "@/db/schema";
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