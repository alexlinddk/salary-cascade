import { getCurrentSnapshot } from "@/lib/data";
import { formatDKK } from "@/lib/cascade";
import AddSpendingForm from "../../components/add-spending-form";
import { SpendingChart } from "../../components/spending-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteSpendingEntry } from "@/lib/actions";

export default async function SpendingPage() {
  const snapshot = await getCurrentSnapshot();

  if (!snapshot) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1">
          Forbrug
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ingen bekræftet måned endnu.
        </p>
        <Button asChild>
          <Link href="/confirm">Bekræft indkomst først →</Link>
        </Button>
      </div>
    );
  }

  const freeMoney = parseFloat(snapshot.freeMoney);
  const spent = parseFloat(snapshot.freeMoneySpent);
  const remaining = freeMoney - spent;
  const spentPct =
    freeMoney > 0 ? Math.min((spent / freeMoney) * 100, 100) : 0;
  const remainingPct = 100 - spentPct;

  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const daysLeft = daysInMonth - now.getDate() + 1;
  const dailyBudget = daysLeft > 0 ? remaining / daysLeft : 0;

  const entries = snapshot.spendingEntries ?? [];
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const progressColor =
    remaining < 0
      ? "[&>[data-slot=progress-indicator]]:bg-red-500"
      : remaining < freeMoney * 0.2
        ? "[&>[data-slot=progress-indicator]]:bg-yellow-500"
        : "[&>[data-slot=progress-indicator]]:bg-violet-400";

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Forbrug</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Hold øje med dit frie forbrug.
      </p>

      <Card className="mb-6">
        <CardContent>
          <p className="text-sm text-muted-foreground mb-1">Frit forbrug</p>

          <Progress value={remainingPct} className={`h-3 my-3 ${progressColor}`} />

          <div className="flex justify-between items-baseline">
            <span
              className={`text-3xl font-light tabular-nums ${remaining < 0 ? "text-red-500" : "text-violet-400"
                }`}
            >
              {formatDKK(remaining)}
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">
              af {formatDKK(freeMoney)}
            </span>
          </div>

          <div className="flex justify-between mt-3 pt-3 border-t text-sm text-muted-foreground">
            <span>~{formatDKK(Math.max(0, dailyBudget))}/dag</span>
            <span>{daysLeft} dage tilbage</span>
          </div>
        </CardContent>
      </Card>

      <AddSpendingForm snapshotId={snapshot.id} />

      <SpendingChart
        entries={sortedEntries.map((e) => ({
          category: e.category,
          amount: parseFloat(e.amount),
        }))}
      />

      {sortedEntries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Seneste forbrug
          </h2>
          <Card>
            <CardContent>
              {sortedEntries.map((entry) => {
                const entryDate = new Date(entry.date);
                const dateStr = entryDate.toLocaleDateString("da-DK", {
                  day: "numeric",
                  month: "short",
                });
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div>
                      <span className="text-sm">{entry.description}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {dateStr}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums text-sm text-red-500">
                        -{formatDKK(parseFloat(entry.amount))}
                      </span>
                      <form
                        action={async () => {
                          "use server";
                          await deleteSpendingEntry(entry.id, snapshot.id);
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
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}