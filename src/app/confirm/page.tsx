import { confirmIncome } from "@/lib/actions";
import { getCascadeData } from "@/lib/data";
import { formatDKK, getCurrentMonth } from "@/lib/cascade";

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

      <div className="rounded-xl border border-border bg-card p-6">
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
            <input
              type="month"
              name="month"
              id="month"
              defaultValue={currentMonth}
              className="w-full bg-accent border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-muted-foreground"
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
            <input
              type="number"
              name="actualIncome"
              id="actualIncome"
              defaultValue={expectedIncome}
              step="0.01"
              className="w-full bg-accent border border-border rounded-lg px-3 py-2.5 text-sm text-foreground tabular-nums focus:outline-none focus:ring-1 focus:ring-muted-foreground"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-success text-background py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Bekræft &amp; generer overførsler →
          </button>
        </form>
      </div>
    </div>
  );
}