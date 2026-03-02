import { TransferItem } from "@/db/schema";
import { toggleTransferItem } from "@/lib/actions";
import { getTransferItems } from "@/lib/data";
import { getCurrentMonth, formatDKK } from "@/lib/cascade";
import Link from "next/link";

function TransferCard({ transfer }: { transfer: TransferItem }) {
  return (
    <div
      className={`flex items-center justify-between py-3 border-b border-border last:border-b-0 ${
        transfer.isCompleted ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <form
          action={async () => {
            "use server";
            await toggleTransferItem(transfer.id, !transfer.isCompleted);
          }}
        >
          <button
            type="submit"
            className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors ${
              transfer.isCompleted
                ? "bg-success border-success text-background"
                : "border-muted-foreground hover:border-foreground"
            }`}
          >
            {transfer.isCompleted && "✓"}
          </button>
        </form>
        <span
          className={`text-sm ${
            transfer.isCompleted ? "line-through text-muted-foreground" : ""
          }`}
        >
          {transfer.name}
        </span>
      </div>
      <span className="tabular-nums text-sm">
        {formatDKK(parseFloat(transfer.amount))}
      </span>
    </div>
  );
}

export default async function TransfersPage() {
  const month = getCurrentMonth();
  const snapshot = await getTransferItems(month);
  const transfers = snapshot?.transferItems ?? [];

  const autoTransfers = transfers.filter((t) => t.type === "auto");
  const manualTransfers = transfers.filter((t) => t.type === "manual");
  const cardTransfers = transfers.filter((t) => t.type === "card");

  const completedCount = transfers.filter((t) => t.isCompleted).length;
  const progress =
    transfers.length > 0 ? (completedCount / transfers.length) * 100 : 0;

  if (transfers.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1">
          Overførsler
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ingen overførsler for denne måned endnu.
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

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Overførsler
      </h1>
      <p className="text-muted-foreground text-sm mb-4">
        Marker overførsler som betalt efterhånden som du gennemfører dem.
      </p>

      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            {completedCount} af {transfers.length} gennemført
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
          <div
            className="h-full bg-success rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {autoTransfers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Betalingsservice (automatisk)
          </h2>
          <div className="rounded-xl border border-border bg-card px-4">
            {autoTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </div>
        </div>
      )}

      {manualTransfers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Manuel overførsel
          </h2>
          <div className="rounded-xl border border-border bg-card px-4">
            {manualTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </div>
        </div>
      )}

      {cardTransfers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Betalt via kort
          </h2>
          <div className="rounded-xl border border-border bg-card px-4">
            {cardTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}