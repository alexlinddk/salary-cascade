import { TransferItem } from "@/db/schema";
import { toggleTransferItem, deleteTransferItem } from "@/lib/actions";
import { getTransferItems } from "@/lib/data";
import { getCurrentMonth, formatDKK } from "@/lib/cascade";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import Link from "next/link";
import { X } from "lucide-react";

function TransferCard({ transfer }: { transfer: TransferItem }) {
  return (
    <div
      className={`flex items-center justify-between py-3 border-b last:border-b-0 ${transfer.isCompleted ? "opacity-50" : ""
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
            className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors ${transfer.isCompleted
              ? "bg-green-500 border-green-500 text-background"
              : "border-muted-foreground hover:border-foreground"
              }`}
          >
            {transfer.isCompleted && "✓"}
          </button>
        </form>
        <span
          className={`text-sm ${transfer.isCompleted ? "line-through text-muted-foreground" : ""
            }`}
        >
          {transfer.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="tabular-nums text-sm">
          {formatDKK(parseFloat(transfer.amount))}
        </span>
        <form
          action={async () => {
            "use server";
            await deleteTransferItem(transfer.id);
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
          >
            <X size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}

function TransferSection({
  title,
  transfers,
}: {
  title: string;
  transfers: TransferItem[];
}) {
  if (transfers.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h2>
      <Card>
        <CardContent>
          {transfers.map((transfer) => (
            <TransferCard key={transfer.id} transfer={transfer} />
          ))}
        </CardContent>
      </Card>
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
  const progressValue =
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
        <Button asChild>
          <Link href="/confirm">Bekræft indkomst først →</Link>
        </Button>
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
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress
          value={progressValue}
          className="*:data-[slot=progress-indicator]:bg-green-500"
        />
      </div>

      <TransferSection title="Betalingsservice (automatisk)" transfers={autoTransfers} />
      <TransferSection title="Manuel overførsel" transfers={manualTransfers} />
      <TransferSection title="Betalt via kort" transfers={cardTransfers} />
    </div>
  );
}