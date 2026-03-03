"use client";

import { addSavingsGoal } from "@/lib/actions";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddSavingsGoalForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        const name = data.get("name") as string;
        const targetAmount = data.get("targetAmount") as string;
        const currentAmount = (data.get("currentAmount") as string) || "0"; const monthlyContribution = data.get("monthlyContribution") as string;
        const priority = data.get("priority") as string;
        await addSavingsGoal(
          name,
          targetAmount,
          currentAmount,
          monthlyContribution,
          parseFloat(priority)
        );
        formRef.current?.reset();
      }}
      className="mt-6 rounded-xl border border-dashed p-5"
    >
      <p className="text-sm text-muted-foreground mb-3">Tilføj nyt mål</p>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="text"
          name="name"
          placeholder="Navn"
          className="col-span-2"
          required
        />
        <Input
          type="number"
          name="targetAmount"
          placeholder="Målbeløb"
          className="tabular-nums"
          required
        />
        <Input
          type="number"
          name="currentAmount"
          placeholder="Allerede sparet"
          className="tabular-nums"
        />
        <Input
          type="number"
          name="monthlyContribution"
          placeholder="Månedligt bidrag"
          className="tabular-nums"
          required
        />
        <Input
          type="number"
          name="priority"
          placeholder="Prioritet"
          required
        />
        <Button type="submit" className="col-span-2">
          Tilføj
        </Button>
      </div>
    </form>
  );
}