"use client";

import { regenerateTransfersAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";

export default function RegenerateButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await regenerateTransfersAction();
        });
      }}
      className="gap-2"
    >
      <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
      {isPending ? "Genberegner..." : "Genberegn overførsler"}
    </Button>
  );
}