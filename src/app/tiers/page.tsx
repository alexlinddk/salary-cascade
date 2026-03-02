import { deleteExpense } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { getTiersWithExpenses } from "@/lib/data";
import AddExpenseForm from "../../components/add-expense-form";

const TIER_DOT_COLORS: Record<number, string> = {
  1: "bg-tier1",
  2: "bg-tier2",
};

export default async function TiersPage() {
  const tiers = await getTiersWithExpenses();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Udgifter</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Administrer dine tiers og tilhørende udgifter.
      </p>

      <div className="space-y-6">
        {tiers.map((tier) => {
          const tierTotal = tier.expenses.reduce(
            (sum, exp) => sum + parseFloat(exp.amount),
            0
          );
          return (
            <div
              key={tier.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      TIER_DOT_COLORS[tier.priority] || "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-lg">{tier.emoji ?? "📋"}</span>
                  <h2 className="text-lg font-medium">{tier.name}</h2>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  P{tier.priority}
                </span>
              </div>

              {tier.expenses.length > 0 ? (
                <div>
                  {tier.expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{expense.name}</span>
                        {expense.isAutoPaid && (
                          <span className="text-[10px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded">
                            AUTO
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="tabular-nums text-sm">
                          {formatDKK(parseFloat(expense.amount))}
                        </span>
                        <form
                          action={async () => {
                            "use server";
                            await deleteExpense(expense.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-muted-foreground hover:text-danger text-xs transition-colors"
                          >
                            ✕
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-2">
                  Ingen udgifter endnu.
                </p>
              )}

              <div className="flex justify-between mt-3 pt-3 border-t border-border">
                <span className="text-sm font-medium">Total</span>
                <span className="tabular-nums text-sm font-semibold">
                  {formatDKK(tierTotal)}
                </span>
              </div>

              <AddExpenseForm tierId={tier.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}