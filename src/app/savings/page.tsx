import { deleteSavingsGoal } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { getSavingsGoals } from "@/lib/data";
import AddSavingsGoalForm from "./add-savings-goal-form";


export default async function SavingsPage() {
    const savingGoals = await getSavingsGoals();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Opsparingsmål</h1>
            <p>Her kan du se og administrere dine opsparingsmål.</p>
            {savingGoals.length === 0 ? (
                <p className="text-gray-500 mt-4">Ingen opsparingsmål tilføjet endnu.</p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {savingGoals.map((goal) => (
                        <li key={goal.id} className="border rounded p-4">
                            <h2 className="text-xl font-semibold">{goal.name}</h2>
                            <p>Prioritet: {goal.priority}</p>
                            <p>Månedligt bidrag: {formatDKK(parseFloat(goal.monthlyContribution))}</p>
                            <p>Nuvarande beløb: {formatDKK(parseFloat(goal.currentAmount))}</p>
                            <p>Målbeløb: {formatDKK(parseFloat(goal.targetAmount))}</p>
                            <span className="font-semibold">Status: </span>
                            {parseFloat(goal.currentAmount) >= parseFloat(goal.targetAmount) ? (
                                <span className="text-green-500">Mål nået!</span>
                            ) : (
                                <span className="text-yellow-500">Undervejs...</span>
                            )}
                            <form action={async () => {
                                "use server";
                                await deleteSavingsGoal(goal.id);
                            }}>
                                <button type="submit" className="text-red-500 text-sm ml-2">Slet</button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
            <AddSavingsGoalForm />
        </div>
    );
}