"use client";

import { addInvestmentAllocation } from "@/lib/actions";
import { useRef } from "react";

export default function AddInvestmentAllocationForm() {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            ref={formRef}
            action={async (data: FormData) => {
                const name = data.get("name") as string;
                const amount = data.get("amount") as string;
                const allocationType = data.get("allocationType") as "fixed" | "percentage";
                await addInvestmentAllocation(name, allocationType, amount);
                formRef.current?.reset();
            }}
        >
            <div className="flex space-x-2 mt-4">
                <input type="text" name="name" placeholder="Investment navn" className="flex-1 border rounded px-3 py-2" required />
                <input type="number" name="amount" placeholder="Beløb" className="w-32 border rounded px-3 py-2" required />
                <input type="radio" name="allocationType" value="fixed" defaultChecked className="w-6 h-6 border rounded" />                <span className="text-gray-700">Fast beløb</span>
                <input type="radio" name="allocationType" value="percentage" className="w-6 h-6 border rounded" />
                <span className="text-gray-700">Procentdel</span>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Tilføj</button>
            </div>
        </form>
    );
}