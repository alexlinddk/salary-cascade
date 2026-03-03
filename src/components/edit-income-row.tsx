"use client";

import { useState } from "react";
import { updateIncomeSource, deleteIncomeSource } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { IncomeSource } from "@/db/schema";
import { Check } from "lucide-react";

export function EditIncomeRow({ source }: { source: IncomeSource }) {
    const [editing, setEditing] = useState(false);
    const [payDay, setPayDay] = useState(String(source.payDay));

    if (editing) {
        return (
            <form
                action={async (data: FormData) => {
                    const name = data.get("name") as string;
                    const amount = data.get("amount") as string;
                    await updateIncomeSource(source.id, name, amount, parseInt(payDay));
                    setEditing(false);
                }}
                className="space-y-3"
            >
                <Input
                    type="text"
                    name="name"
                    defaultValue={source.name}
                    required
                />
                <div className="flex gap-2">
                    <Input
                        type="number"
                        name="amount"
                        defaultValue={source.expectedAmount}
                        step="0.01"
                        className="flex-1 tabular-nums"
                        required
                    />
                    <div className="flex rounded-lg border overflow-hidden">
                        <Button
                            type="button"
                            variant={payDay === "-1" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-none"
                            onClick={() => setPayDay("-1")}
                        >
                            Sidste bankdag
                        </Button>
                        <Button
                            type="button"
                            variant={payDay === "1" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-none"
                            onClick={() => setPayDay("1")}
                        >
                            Første bankdag
                        </Button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="submit" size="sm" className="gap-1.5">
                        <Check size={14} />
                        Gem
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setPayDay(String(source.payDay));
                            setEditing(false);
                        }}
                    >
                        Annuller
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-medium">{source.name}</h2>
                    {source.isRecurring && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            FAST
                        </Badge>
                    )}
                </div>
                <div className="flex gap-3 text-sm text-muted-foreground">
                    <span className="tabular-nums">
                        {formatDKK(parseFloat(source.expectedAmount))}
                    </span>
                    <span>
                        {source.payDay === -1
                            ? "Sidste bankdag"
                            : `d. ${source.payDay}`}{" "}
                        hver måned
                    </span>
                </div>
            </div>
            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setEditing(true)}
                >
                    ✎
                </Button>
                <form
                    action={async () => {
                        await deleteIncomeSource(source.id);
                    }}
                >
                    <Button
                        type="submit"
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-destructive"
                    >
                        ✕
                    </Button>
                </form>
            </div>
        </div>
    );
}