"use client";

import { addIncomeSource } from "@/lib/actions";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export function AddIncomeForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [payDay, setPayDay] = useState("-1");

    return (
        <form
            ref={formRef}
            action={async (data: FormData) => {
                const name = data.get("name") as string;
                const amount = data.get("amount") as string;
                await addIncomeSource(name, amount, parseInt(payDay));
                formRef.current?.reset();
                setPayDay("-1");
            }}
            className="mt-6 rounded-xl border border-dashed p-5"
        >
            <p className="text-sm text-muted-foreground mb-3">
                Tilføj indkomstkilde
            </p>
            <div className="space-y-3">
                <Input
                    type="text"
                    name="name"
                    placeholder="Navn (f.eks. Løn — NOVAX)"
                    required
                />
                <div className="flex gap-2">
                    <Input
                        type="number"
                        name="amount"
                        placeholder="Beløb (DKK)"
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
                <Button type="submit" className="w-full gap-1.5">
                    <Plus size={14} />
                    Tilføj
                </Button>
            </div>
        </form>
    );
}