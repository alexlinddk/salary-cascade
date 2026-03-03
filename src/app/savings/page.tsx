import { getSavingsGoals } from "@/lib/data";
import { EditSavingsRow } from "../../components/edit-savings-row";
import { Card, CardContent } from "@/components/ui/card";
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
          {savingGoals.map((goal) => (
            <Card key={goal.id}>
              <CardContent>
                <EditSavingsRow goal={goal} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddSavingsGoalForm />
    </div>
  );
}