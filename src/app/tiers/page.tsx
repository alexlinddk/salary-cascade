import { deleteExpense } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { getTiersWithExpenses } from "@/lib/data";
import AddExpenseForm from "./add-expense-form";

export default async function TiersPage() {
    const tiers = await getTiersWithExpenses();

    return (
        <div className="max-w-xl mx-auto pt-16">
            <h1 className="text-4xl font-bold mb-8">Tiers</h1>
            <p className="text-gray-600">Her kan du se og redigere dine tiers og tilhørende udgifter.</p>

            {tiers.map((tier) => (
                <div key={tier.id} className="border rounded p-4 mb-6">
                    <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{tier.emoji ?? "📋"}</span>
                        <h2 className="text-xl font-semibold">{tier.name}</h2>
                    </div>
                    <p className="text-gray-500 mb-4">Prioritet: {tier.priority}</p>
                    {tier.expenses.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {tier.expenses.map((expense) => (
                                <li key={expense.id} className="flex justify-between">
                                    <span>{expense.name}</span>
                                    <div className="flex">{formatDKK(parseFloat(expense.amount))}
                                        <form action={async () => {
                                            "use server";
                                            await deleteExpense(expense.id);
                                        }}>
                                            <button type="submit" className="text-red-500 text-sm ml-2">Slet</button>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    ) : (
                        <p className="text-gray-500">Ingen udgifter tilføjet endnu.</p>
                    )}
                    <div className="flex justify-between font-semibold mt-4 pt-2 border-t border-gray-700">
                        <span>Total</span>
                        <span>
                            {formatDKK(tier.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0))}
                        </span>
                    </div>
                    <AddExpenseForm tierId={tier.id} />
                </div>
            ))}
        </div>

    );
}