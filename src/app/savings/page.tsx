import { deleteSavingsGoal } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { getSavingsGoals } from "@/lib/data";
import AddSavingsGoalForm from "../../components/add-savings-goal-form";

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
              <div
                key={goal.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{goal.emoji ?? "🎯"}</span>
                    <h2 className="font-medium">{goal.name}</h2>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await deleteSavingsGoal(goal.id);
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

                <div className="w-full h-2 bg-accent rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: isComplete
                        ? "var(--success)"
                        : "var(--savings-color)",
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="tabular-nums text-muted-foreground">
                    {formatDKK(current)} / {formatDKK(target)}
                  </span>
                  <span className="text-muted-foreground">
                    {isComplete ? (
                      <span className="text-success">Nået ✓</span>
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
              </div>
            );
          })}
        </div>
      )}

      <AddSavingsGoalForm />
    </div>
  );
}