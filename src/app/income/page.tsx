import { deleteIncomeSource } from "@/lib/actions";
import { formatDKK } from "@/lib/cascade";
import { getIncomeSources } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddIncomeForm } from "../../components/add-income-form";
import { EditIncomeRow } from "../../components/edit-income-row";

export default async function IncomePage() {
    const sources = await getIncomeSources();

    const total = sources.reduce(
        (sum, src) => sum + parseFloat(src.expectedAmount),
        0
    );

    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Indkomst</h1>
            <p className="text-muted-foreground text-sm mb-8">
                Dine indkomstkilder.
            </p>

            {sources.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                    Ingen indkomstkilder endnu.
                </p>
            ) : (
                <div className="space-y-3">
                    {sources.map((source) => (
                        <Card key={source.id}>
                            <CardContent>
                                <EditIncomeRow source={source} />
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-between px-2 pt-2 text-sm">
                        <span className="font-medium">Total</span>
                        <span className="tabular-nums font-semibold">
                            {formatDKK(total)}
                        </span>
                    </div>
                </div>
            )}

            <AddIncomeForm />
        </div>
    );
}