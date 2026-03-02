import { getCascadeData } from "@/lib/data";
import { cascade, formatDKK } from "@/lib/cascade";
import { CascadeBreakdown } from "../../components/cascade-breakdown";
import Link from "next/link";

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
    emoji: tier.emoji ?? "📋",
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

  const result = cascade(
    totalIncome,
    cascadeTiers,
    cascadeSavings,
    cascadeInvestments
  );

  const isDeficit = result.freeMoney < 0;

  return (
    <div>
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
          Du kan bruge
        </p>
        <h1
          className={`text-6xl sm:text-7xl font-light tracking-tight tabular-nums ${
            isDeficit ? "text-danger" : "text-free"
          }`}
        >
          {formatDKK(Math.abs(result.freeMoney))}
        </h1>
        {isDeficit && (
          <p className="text-danger text-sm mt-2">Underskud denne måned</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">denne måned</p>
      </div>

      <div className="border-t border-border my-2" />

      <CascadeBreakdown result={result} />

      <div className="mt-8">
        <Link
          href="/confirm"
          className="block w-full text-center py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          Bekræft &amp; se overførsler →
        </Link>
      </div>
    </div>
  );
}