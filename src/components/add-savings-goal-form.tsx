"use client";

import { addSavingsGoal } from "@/lib/actions";
import { useRef } from "react";

export default function AddSavingsGoalForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        const name = data.get("name") as string;
        const targetAmount = data.get("targetAmount") as string;
        const monthlyContribution = data.get("monthlyContribution") as string;
        const priority = data.get("priority") as string;
        await addSavingsGoal(
          name,
          targetAmount,
          monthlyContribution,
          parseFloat(priority)
        );
        formRef.current?.reset();
      }}
      className="mt-6 rounded-xl border border-dashed border-border p-5"
    >
      <p className="text-sm text-muted-foreground mb-3">Tilføj nyt mål</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          name="name"
          placeholder="Navn"
          className="col-span-2 bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground"
          required
        />
        <input
          type="number"
          name="targetAmount"
          placeholder="Målbeløb"
          className="bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground tabular-nums"
          required
        />
        <input
          type="number"
          name="monthlyContribution"
          placeholder="Månedligt bidrag"
          className="bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground tabular-nums"
          required
        />
        <input
          type="number"
          name="priority"
          placeholder="Prioritet"
          className="bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground"
          required
        />
        <button
          type="submit"
          className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Tilføj
        </button>
      </div>
    </form>
  );
}