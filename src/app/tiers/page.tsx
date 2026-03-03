import { deleteExpense } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { getTiersWithExpenses } from "@/lib/data";
import AddExpenseForm from "../../components/add-expense-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
                      <div
                        key={expense.id}
                        className="flex items-center justify-between py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{expense.name}</span>
                          {expense.isAutoPaid && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              AUTO
                            </Badge>
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
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ✕
                            </Button>
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