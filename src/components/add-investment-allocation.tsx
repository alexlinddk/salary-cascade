"use client";

import { addInvestmentAllocation } from "@/lib/actions";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function AddInvestmentAllocationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [allocationType, setAllocationType] = useState<"fixed" | "percentage">(
    "fixed"
  );

  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        const name = data.get("name") as string;
        const amount = data.get("amount") as string;
        await addInvestmentAllocation(name, allocationType, amount);
        formRef.current?.reset();
        setAllocationType("fixed");
      }}
      className="mt-6 rounded-xl border border-dashed p-5"
    >
      <p className="text-sm text-muted-foreground mb-3">
        Tilføj investering
      </p>
      <div className="space-y-3">
        <Input
          type="text"
          name="name"
          placeholder="Navn (f.eks. Nordnet ETF)"
          required
        />
        <div className="flex gap-2">
          <Input
            type="number"
            name="amount"
            placeholder={allocationType === "fixed" ? "Beløb (kr)" : "Procent (%)"}
            className="flex-1 tabular-nums"
            required
          />
          <div className="flex rounded-lg border overflow-hidden">
            <Button
              type="button"
              variant={allocationType === "fixed" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setAllocationType("fixed")}
            >
              kr
            </Button>
            <Button
              type="button"
              variant={allocationType === "percentage" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setAllocationType("percentage")}
            >
              %
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full gap-1.5">
          <Plus size={14} />
          Tilføj
        </Button>
      </div>
    </form>
  );
}