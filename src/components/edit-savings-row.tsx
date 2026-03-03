"use client";

import { useState } from "react";
import { updateSavingsGoal, deleteSavingsGoal } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { SavingsGoal } from "@/db/schema";
import { Check, Pencil, X } from "lucide-react";

export function EditSavingsRow({ goal }: { goal: SavingsGoal }) {
    const [editing, setEditing] = useState(false);

    const current = parseFloat(goal.currentAmount);
    const target = parseFloat(goal.targetAmount);
    const monthly = parseFloat(goal.monthlyContribution);
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const isComplete = current >= target;
    const remaining = Math.max(0, target - current);
    const monthsLeft = monthly > 0 ? Math.ceil(remaining / monthly) : null;

    if (editing) {
        return (
            <form
                action={async (data: FormData) => {
                    const name = data.get("name") as string;
                    const targetAmount = data.get("targetAmount") as string;
                    const monthlyContribution = data.get("monthlyContribution") as string;
                    const priority = parseInt(data.get("priority") as string);
                    await updateSavingsGoal(goal.id, name, targetAmount, monthlyContribution, priority);
                    setEditing(false);
                }}
                className="space-y-3"
            >
                <Input
                    type="text"
                    name="name"
                    defaultValue={goal.name}
                    required
                />
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        type="number"
                        name="targetAmount"
                        defaultValue={goal.targetAmount}
                        step="0.01"
                        placeholder="Målbeløb"
                        className="tabular-nums"
                        required
                    />
                    <Input
                        type="number"
                        name="monthlyContribution"
                        defaultValue={goal.monthlyContribution}
                        step="0.01"
                        placeholder="Månedligt bidrag"
                        className="tabular-nums"
                        required
                    />
                </div>
                <Input
                    type="number"
                    name="priority"
                    defaultValue={goal.priority}
                    placeholder="Prioritet"
                    className="w-28"
                    required
                />
                <div className="flex gap-2">
                    <Button type="submit" size="sm" className="gap-1.5">
                        <Check size={14} />
                        Gem
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(false)}
                    >
                        Annuller
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h2 className="font-medium">{goal.name}</h2>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon-xs" onClick={() => setEditing(true)}>
                        <Pencil size={14} />
                    </Button>
                    <form
                        action={async () => {
                            await deleteSavingsGoal(goal.id);
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

            <Progress
                value={progress}
                className={
                    isComplete
                        ? "*:data-[slot=progress-indicator]:bg-green-500"
                        : "*:data-[slot=progress-indicator]:bg-emerald-400"
                }
            />

            <div className="flex justify-between text-sm mt-2">
                <span className="tabular-nums text-muted-foreground">
                    {formatDKK(current)} / {formatDKK(target)}
                </span>
                <span className="text-muted-foreground">
                    {isComplete ? (
                        <span className="text-green-500">Nået ✓</span>
                    ) : (
                        `${Math.round(progress)}%`
                    )}
                </span>
            </div>

            {!isComplete && (
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>
                        {monthly > 0
                            ? `${formatDKK(monthly)}/md`
                            : "Intet månedligt bidrag"}
                    </span>
                    {monthsLeft !== null && (
                        <span>~{monthsLeft} md. tilbage</span>
                    )}
                </div>
            )}
        </div>
    );
}