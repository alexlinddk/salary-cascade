import { deleteSavingsGoal } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { getSavingsGoals } from "@/lib/data";
import AddSavingsGoalForm from "../../components/add-savings-goal-form";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default async function SavingsPage() {
  const savingGoals = await getSavingsGoals();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Opsparing</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Dine opsparingsmål og fremgang.
      </p>

      {savingGoals.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Ingen opsparingsmål endnu.
        </p>
      ) : (
        <div className="space-y-4">
          {savingGoals.map((goal) => {
            const current = parseFloat(goal.currentAmount);
            const target = parseFloat(goal.targetAmount);
            const monthly = parseFloat(goal.monthlyContribution);
            const progress =
              target > 0 ? Math.min((current / target) * 100, 100) : 0;
            const isComplete = current >= target;
            const remaining = Math.max(0, target - current);
            const monthsLeft =
              monthly > 0 ? Math.ceil(remaining / monthly) : null;

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{goal.emoji ?? "🎯"}</span>
                    <CardTitle>{goal.name}</CardTitle>
                  </div>
                  <CardAction>
                    <form
                      action={async () => {
                        "use server";
                        await deleteSavingsGoal(goal.id);
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
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <Progress
                    value={progress}
                    className={isComplete ? "*:data-[slot=progress-indicator]:bg-green-500" : "*:data-[slot=progress-indicator]:bg-emerald-400"}
                  />

                  <div className="flex justify-between text-sm mt-2">
                    <span className="tabular-nums text-muted-foreground">
                      {formatDKK(current)} / {formatDKK(target)}
                    </span>
                    <span className="text-muted-foreground">
                      {isComplete ? (
                        <span className="text-green-500">Nået ✓</span>
                      ) : (
                        `${Math.round(progress)}%`
                      )}
                    </span>
                  </div>

                  {!isComplete && (
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        {monthly > 0
                          ? `${formatDKK(monthly)}/md`
                          : "Intet månedligt bidrag"}
                      </span>
                      {monthsLeft !== null && (
                        <span>~{monthsLeft} md. tilbage</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddSavingsGoalForm />
    </div>
  );
}