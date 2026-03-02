import { deleteInvestmentAllocation } from "@/lib/actions";
import { getInvestmentAllocations } from "@/lib/data";
import AddInvestmentAllocationForm from "../../components/add-investment-allocation";
import { formatDKK } from "@/lib/cascade";

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
            <div
              key={investment.id}
              className="rounded-xl border border-border bg-card p-5 flex items-center justify-between"
            >
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
                  <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded">
                    {investment.allocationType === "fixed"
                      ? "FAST"
                      : "PROCENT"}
                  </span>
                  {investment.broker && (
                    <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded">
                      {investment.broker}
                    </span>
                  )}
                </div>
              </div>
              <form
                action={async () => {
                  "use server";
                  await deleteInvestmentAllocation(investment.id);
                }}
              >
                <button
                  type="submit"
                  className="text-muted-foreground hover:text-danger text-xs transition-colors"
                >
                  ✕
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <AddInvestmentAllocationForm />
    </div>
  );
}