import { getCurrentSnapshot } from "@/lib/data";
import { formatDKK } from "@/lib/cascade";
import AddSpendingForm from "../../components/add-spending-form";
import Link from "next/link";

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
        <Link
          href="/confirm"
          className="inline-block bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Bekræft indkomst først →
        </Link>
      </div>
    );
  }

  const freeMoney = parseFloat(snapshot.freeMoney);
  const spent = parseFloat(snapshot.freeMoneySpent);
  const remaining = freeMoney - spent;
  const progress =
    freeMoney > 0 ? Math.min((spent / freeMoney) * 100, 100) : 0;

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

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Forbrug</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Hold øje med dit frie forbrug.
      </p>

      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-1">Frit forbrug</p>

        <div className="w-full h-3 bg-accent rounded-full overflow-hidden my-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${100 - progress}%`,
              backgroundColor:
                remaining < 0
                  ? "var(--danger)"
                  : remaining < freeMoney * 0.2
                  ? "var(--warning)"
                  : "var(--free-color)",
            }}
          />
        </div>

        <div className="flex justify-between items-baseline">
          <span
            className={`text-3xl font-light tabular-nums ${
              remaining < 0 ? "text-danger" : "text-free"
            }`}
          >
            {formatDKK(remaining)}
          </span>
          <span className="text-sm text-muted-foreground tabular-nums">
            af {formatDKK(freeMoney)}
          </span>
        </div>

        <div className="flex justify-between mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
          <span>~{formatDKK(Math.max(0, dailyBudget))}/dag</span>
          <span>{daysLeft} dage tilbage</span>
        </div>
      </div>

      <AddSpendingForm snapshotId={snapshot.id} />

      {sortedEntries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Seneste forbrug
          </h2>
          <div className="rounded-xl border border-border bg-card px-4">
            {sortedEntries.map((entry) => {
              const entryDate = new Date(entry.date);
              const dateStr = entryDate.toLocaleDateString("da-DK", {
                day: "numeric",
                month: "short",
              });
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <div>
                    <span className="text-sm">{entry.description}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {dateStr}
                    </span>
                  </div>
                  <span className="tabular-nums text-sm text-danger">
                    -{formatDKK(parseFloat(entry.amount))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}