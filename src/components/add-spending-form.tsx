"use client";

import { addSpendingEntry } from "@/lib/actions";
import { useRef } from "react";

const CATEGORIES = [
  "Mad & drikke",
  "Transport",
  "Underholdning",
  "Tøj",
  "Restaurant",
  "Bar",
  "Andet",
];

export default function AddSpendingForm({
  snapshotId,
}: {
  snapshotId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        const description = data.get("description") as string;
        const amount = data.get("amount") as string;
        const category = data.get("category") as string;
        await addSpendingEntry(snapshotId, description, amount, category);
        formRef.current?.reset();
      }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <p className="text-sm text-muted-foreground mb-3">Log forbrug</p>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="description"
            placeholder="Hvad brugte du penge på?"
            className="flex-1 bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Beløb"
            step="0.01"
            className="w-28 bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground tabular-nums"
            required
          />
        </div>
        <div className="flex gap-2">
          <select
            name="category"
            className="flex-1 bg-accent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground"
            defaultValue="Andet"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-foreground text-background px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Tilføj
          </button>
        </div>
      </div>
    </form>
  );
}