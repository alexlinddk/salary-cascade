"use client";

import { addExpense } from "@/lib/actions";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

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
        <Input
          type="text"
          name="name"
          placeholder="Udgiftsnavn"
          className="flex-1"
          required
        />
        <Input
          type="number"
          name="amount"
          placeholder="Beløb"
          className="w-28 tabular-nums"
          required
        />
        <Button type="submit" className="gap-1.5">
          <Plus size={14} />
          Tilføj
        </Button>      </div>
    </form>
  );
}