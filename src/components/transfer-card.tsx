"use client";

import { toggleTransferItem, updateTransferItem, deleteTransferItem } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { TransferItem } from "@/db/schema";

export default function TransferCard({ transfer }: { transfer: TransferItem }) {
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [editAmount, setEditAmount] = useState(transfer.amount);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAmountClick() {
    if (transfer.isCompleted) return;
    setEditAmount(transfer.amount);
    setIsEditingAmount(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function handleAmountSave() {
    if (!editAmount || parseFloat(editAmount) <= 0) {
      setEditAmount(transfer.amount);
      setIsEditingAmount(false);
      return;
    }
    startTransition(async () => {
      await updateTransferItem(transfer.id, editAmount);
      setIsEditingAmount(false);
    });
  }

  function handleAmountCancel() {
    setEditAmount(transfer.amount);
    setIsEditingAmount(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAmountSave();
    }
    if (e.key === "Escape") {
      handleAmountCancel();
    }
  }

  return (
    <div
      className={`flex items-center justify-between py-3 border-b last:border-b-0 ${
        transfer.isCompleted ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <form
          action={async () => {
            await toggleTransferItem(transfer.id, !transfer.isCompleted);
          }}
        >
          <button
            type="submit"
            className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors ${
              transfer.isCompleted
                ? "bg-green-500 border-green-500 text-background"
                : "border-muted-foreground hover:border-foreground"
            }`}
          >
            {transfer.isCompleted && "✓"}
          </button>
        </form>
        <span
          className={`text-sm ${
            transfer.isCompleted ? "line-through text-muted-foreground" : ""
          }`}
        >
          {transfer.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isEditingAmount ? (
          <Input
            ref={inputRef}
            type="number"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAmountSave}
            step="0.01"
            className="w-24 h-7 text-sm text-right tabular-nums"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={handleAmountClick}
            disabled={transfer.isCompleted}
            className={`tabular-nums text-sm ${
              transfer.isCompleted
                ? ""
                : "hover:text-yellow-400 cursor-pointer transition-colors"
            }`}
            title={transfer.isCompleted ? undefined : "Klik for at redigere beløb"}
          >
            {formatDKK(parseFloat(transfer.amount))}
          </button>
        )}
        <form
          action={async () => {
            await deleteTransferItem(transfer.id);
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
          >
            <X size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}