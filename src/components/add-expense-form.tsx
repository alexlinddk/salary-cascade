"use client";

import { addExpense } from "@/lib/actions";
import { useRef } from "react";

export default function AddExpenseForm({ tierId }: { tierId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        const name = data.get("name") as string;
        const amount = data.get("amount") as string;
        await addExpense(tierId, name, amount);
        formRef.current?.reset();
      }}
      className="mt-4"
    >
      <div className="flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="Udgiftsnavn"
          className="flex-1 bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Beløb"
          className="w-28 bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground tabular-nums"
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