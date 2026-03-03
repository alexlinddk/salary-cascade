"use client";

import { addSpendingEntry } from "@/lib/actions";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const CATEGORIES = [
  "Mad & drikke",
  "Transport",
  "Underholdning",
  "Tøj",
  "Restaurant",
  "Bar",
  "Andet",
];

export default function AddSpendingForm({
  snapshotId,
}: {
  snapshotId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState("Andet");

  return (
    <Card>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">Log forbrug</p>
        <form
          ref={formRef}
          action={async (data: FormData) => {
            const description = data.get("description") as string;
            const amount = data.get("amount") as string;
            await addSpendingEntry(snapshotId, description, amount, category);
            formRef.current?.reset();
            setCategory("Andet");
          }}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <Input
              type="text"
              name="description"
              placeholder="Hvad brugte du penge på?"
              className="flex-1"
              required
            />
            <Input
              type="number"
              name="amount"
              placeholder="Beløb"
              step="0.01"
              className="w-28 tabular-nums"
              required
            />
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Tilføj</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}