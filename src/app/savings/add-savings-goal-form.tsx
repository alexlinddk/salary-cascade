"use client";

import { addSavingsGoal } from "@/lib/actions";
import { useRef } from "react";

export default function AddSavingsGoalForm() {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            ref={formRef}
            action={async (data: FormData) => {
                const name = data.get("name") as string;
                const targetAmount = data.get("targetAmount") as string;
                const monthlyContribution = data.get("monthlyContribution") as string;
                const priority = data.get("priority") as string;
                await addSavingsGoal(name, targetAmount, monthlyContribution, parseFloat(priority));
                formRef.current?.reset();
            }}
        >
            <div className="flex space-x-2 mt-4">
                <input type="text" name="name" placeholder="Udgiftsnavn" className="flex-1 border rounded px-3 py-2" required />
                <input type="number" name="targetAmount" placeholder="Målbeløb" className="w-32 border rounded px-3 py-2" required />
                <input type="number" name="monthlyContribution" placeholder="Månedligt bidrag" className="w-32 border rounded px-3 py-2" required />
                <input type="number" name="priority" placeholder="Prioritet" className="w-24 border rounded px-3 py-2" required />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Tilføj</button>
            </div>
        </form>
    );
}