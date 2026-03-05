import { formatDKK } from "@/lib/cascade";
import { getTiersWithExpenses } from "@/lib/data";
import AddExpenseForm from "../../components/add-expense-form";
import ExpenseRow from "../../components/expense-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        Administrer dine tiers og tilhørende udgifter. Klik på en udgift for at
        redigere.
      </p>

      <div className="space-y-6">
        {tiers.map((tier) => {
          const tierTotal = tier.expenses.reduce(
            (sum, exp) => sum + parseFloat(exp.amount),
            0
          );
          return (
            <Card key={tier.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        TIER_DOT_COLORS[tier.priority] || "bg-muted-foreground"
                      }`}
                    />
                    <CardTitle>{tier.name}</CardTitle>
                  </div>
                  <Badge variant="outline">P{tier.priority}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                {tier.expenses.length > 0 ? (
                  <div>
                    {tier.expenses.map((expense) => (
                      <ExpenseRow key={expense.id} expense={expense} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-2">
                    Ingen udgifter endnu.
                  </p>
                )}

                <div className="flex justify-between mt-3 pt-3 border-t">
                  <span className="text-sm font-medium">Total</span>
                  <span className="tabular-nums text-sm font-semibold">
                    {formatDKK(tierTotal)}
                  </span>
                </div>

                <AddExpenseForm tierId={tier.id} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}