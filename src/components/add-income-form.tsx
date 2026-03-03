"use client";

import { addIncomeSource } from "@/lib/actions";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddIncomeForm() {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            ref={formRef}
            action={async (data: FormData) => {
                const name = data.get("name") as string;
                const amount = data.get("amount") as string;
                const payDay = parseInt(data.get("payDay") as string);
                await addIncomeSource(name, amount, payDay);
                formRef.current?.reset();
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
                    <Input
                        type="number"
                        name="payDay"
                        placeholder="Løndag"
                        min={1}
                        max={31}
                        className="w-20"
                        required
                    />
                </div>
                <Button type="submit" className="w-full">Tilføj</Button>
            </div>
        </form>
    );
}