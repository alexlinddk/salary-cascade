import { deleteInvestmentAllocation } from "@/lib/actions";
import { getInvestmentAllocations } from "@/lib/data";
import AddInvestmentAllocationForm from "../../components/add-investment-allocation";
import { formatDKK } from "@/lib/cascade";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function InvestmentsPage() {
  const investmentAllocations = await getInvestmentAllocations();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Investeringer
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Dine investeringsallokeringer.
      </p>

      {investmentAllocations.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Ingen investeringer endnu.
        </p>
      ) : (
        <div className="space-y-3">
          {investmentAllocations.map((investment) => (
            <Card key={investment.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-invest" />
                    <h2 className="font-medium">{investment.name}</h2>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span className="tabular-nums">
                      {investment.allocationType === "fixed"
                        ? formatDKK(parseFloat(investment.amount))
                        : `${investment.amount}%`}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {investment.allocationType === "fixed"
                        ? "FAST"
                        : "PROCENT"}
                    </Badge>
                    {investment.broker && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {investment.broker}
                      </Badge>
                    )}
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteInvestmentAllocation(investment.id);
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddInvestmentAllocationForm />
    </div>
  );
}