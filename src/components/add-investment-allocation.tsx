"use client";

import { addInvestmentAllocation } from "@/lib/actions";
import { useRef, useState } from "react";

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
      className="mt-6 rounded-xl border border-dashed border-border p-5"
    >
      <p className="text-sm text-muted-foreground mb-3">
        Tilføj investering
      </p>
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Navn (f.eks. Nordnet ETF)"
          className="w-full bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground"
          required
        />
        <div className="flex gap-2">
          <input
            type="number"
            name="amount"
            placeholder={
              allocationType === "fixed" ? "Beløb i DKK" : "Procent"
            }
            className="flex-1 bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground tabular-nums"
            required
          />
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setAllocationType("fixed")}
              className={`px-3 py-2 text-sm transition-colors ${
                allocationType === "fixed"
                  ? "bg-foreground text-background"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              Fast
            </button>
            <button
              type="button"
              onClick={() => setAllocationType("percentage")}
              className={`px-3 py-2 text-sm transition-colors ${
                allocationType === "percentage"
                  ? "bg-foreground text-background"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              %
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Tilføj
        </button>
      </div>
    </form>
  );
}