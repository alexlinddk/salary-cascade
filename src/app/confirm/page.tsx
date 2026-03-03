import { confirmIncome } from "@/lib/actions";
import { getCascadeData } from "@/lib/data";
import { formatDKK, getCurrentMonth } from "@/lib/cascade";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ConfirmPage() {
  const data = await getCascadeData();
  const expectedIncome = data.income.reduce(
    (sum, src) => sum + parseFloat(src.expectedAmount),
    0
  );
  const currentMonth = getCurrentMonth();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Bekræft indkomst
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Indtast din faktiske indkomst for at køre kaskaden og generere
        overførselslisten.
      </p>

      <Card>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">
              Forventet indkomst
            </p>
            <p className="text-2xl font-light tabular-nums">
              {formatDKK(expectedIncome)}
            </p>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              const month = formData.get("month") as string;
              const actualIncome = formData.get("actualIncome") as string;
              await confirmIncome(month, actualIncome);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="month"
                className="block text-sm text-muted-foreground mb-1"
              >
                Måned
              </label>
              <Input
                type="month"
                name="month"
                id="month"
                defaultValue={currentMonth}
                required
              />
            </div>
            <div>
              <label
                htmlFor="actualIncome"
                className="block text-sm text-muted-foreground mb-1"
              >
                Faktisk indkomst (DKK)
              </label>
              <Input
                type="number"
                name="actualIncome"
                id="actualIncome"
                defaultValue={expectedIncome}
                step="0.01"
                className="tabular-nums"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-500/90 text-background"
              size="lg"
            >
              Bekræft &amp; generer overførsler →
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}