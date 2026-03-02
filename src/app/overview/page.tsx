import { getCascadeData } from "@/lib/data";
import { cascade, formatDKK } from "@/lib/cascade";

export default async function OverviewPage() {
    const data = await getCascadeData();

    const totalIncome = data.income.reduce(
        (sum, src) => sum + parseFloat(src.expectedAmount),
        0
    );

    const cascadeTiers = data.tiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        priority: tier.priority,
        items: tier.expenses.map((exp) => ({
            id: exp.id,
            name: exp.name,
            amount: parseFloat(exp.amount),
        })),
    }));

    const cascadeSavings = data.savings.map((goal) => ({
        id: goal.id,
        name: goal.name,
        monthlyContribution: parseFloat(goal.monthlyContribution),
        priority: goal.priority,
        targetAmount: parseFloat(goal.targetAmount),
        currentAmount: parseFloat(goal.currentAmount),
    }));

    const cascadeInvestments = data.investments.map((inv) => ({
        id: inv.id,
        name: inv.name,
        allocationType: inv.allocationType,
        amount: parseFloat(inv.amount),
    }));

    const result = cascade(totalIncome, cascadeTiers, cascadeSavings, cascadeInvestments);

    return (
        <div className="max-w-xl mx-auto pt-16">
            {/* Hero */}
            <div className="text-center mb-12">
                {result.freeMoney < 0 && (
                    <p className="text-red-500 mt-2">
                        Advarsel: Du har et underskud på {formatDKK(-result.freeMoney)} denne måned!
                    </p>
                )}
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Du kan bruge
                </p>
                <h1 className="text-6xl font-light tracking-tight">
                    {formatDKK(result.freeMoney)}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    denne måned
                </p>

                {result.totalIncome > 0 && <p>Indkomst: {formatDKK(result.totalIncome)}</p>}
                {result.tierAllocations.map((tier) => (
                    <div key={tier.tierId}>
                        <p>{tier.tierName}: {formatDKK(tier.allocated)}</p>
                    </div>

                ))}
                {result.savingsAllocated > 0 && <p>Opsparing: {formatDKK(result.savingsAllocated)}</p>}
                {result.investmentsAllocated > 0 && <p>Investering: {formatDKK(result.investmentsAllocated)}</p>}
                {result.freeMoney > 0 && <p>Frit forbrug: {formatDKK(result.freeMoney)} </p>}
                {result.warnings.length > 0 && (
                    <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                        <p className="font-semibold">Advarsler:</p>
                        <ul className="list-disc list-inside">
                            {result.warnings.map((warning, idx) => (
                                <li key={idx}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
}