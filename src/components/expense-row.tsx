"use client";

import { updateExpense, deleteExpense } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";

type Expense = {
  id: string;
  name: string;
  amount: string;
  category: string;
  dueDate: number | null;
  isAutoPaid: boolean;
  isFixed: boolean;
  notes: string | null;
};

const CATEGORIES = [
  "Uncategorized",
  "Bolig",
  "Forsikring",
  "Transport",
  "Abonnement",
  "Gæld",
  "Øvrig",
];

export default function ExpenseRow({ expense }: { expense: Expense }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [dueDate, setDueDate] = useState(
    expense.dueDate !== null ? String(expense.dueDate) : ""
  );
  const [isAutoPaid, setIsAutoPaid] = useState(expense.isAutoPaid);

  function handleCancel() {
    setName(expense.name);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDueDate(expense.dueDate !== null ? String(expense.dueDate) : "");
    setIsAutoPaid(expense.isAutoPaid);
    setIsEditing(false);
  }

  function handleSave() {
    startTransition(async () => {
      await updateExpense(expense.id, {
        name,
        amount,
        category,
        dueDate: dueDate ? parseInt(dueDate) : null,
        isAutoPaid,
      });
      setIsEditing(false);
    });
  }

  if (isEditing) {
    return (
      <div className="py-3 border-b last:border-b-0">
        <form action={handleSave} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Udgiftsnavn"
              required
              autoFocus
            />
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Beløb"
              step="0.01"
              className="w-28 tabular-nums"
              required
            />
          </div>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 bg-transparent border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Dag (1-31)"
              min="1"
              max="31"
              className="w-28 tabular-nums"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={isAutoPaid}
                onChange={(e) => setIsAutoPaid(e.target.checked)}
                className="rounded border-input"
              />
              Betalingsservice (auto)
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                Annuller
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="gap-1.5"
              >
                <Check size={14} />
                {isPending ? "Gemmer..." : "Gem"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0 group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm truncate">{expense.name}</span>
        {expense.isAutoPaid && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
            AUTO
          </span>
        )}
        {expense.category !== "Uncategorized" && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
            {expense.category}
          </span>
        )}
        {expense.dueDate && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
            d. {expense.dueDate}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="tabular-nums text-sm">
          {formatDKK(parseFloat(expense.amount))}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100"
        >
          <Pencil size={14} />
        </Button>
        <form
          action={async () => {
            await deleteExpense(expense.id);
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
          >
            <X size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}