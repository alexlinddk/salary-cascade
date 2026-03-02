import { deleteInvestmentAllocation } from "@/lib/actions";
import { getInvestmentAllocations } from "@/lib/data";
import AddInvestmentAllocationForm from "./add-investment-allocation";
import { formatDKK } from "@/lib/cascade";

export default async function InvestmentsPage() {
    const investmentAllocations = await getInvestmentAllocations();
    return (
        <div>

            <div>
                <h1 className="text-2xl font-bold mb-4">Investeringer</h1>
            </div>
            <ul className="mt-4 space-y-4">
                {investmentAllocations.map((investment) => (
                    <li key={investment.id} className="border rounded p-4">
                        <h2 className="text-xl font-semibold">{investment.name}</h2>
                        <p>Beløb: {formatDKK(parseFloat(investment.amount))}</p>
                        <p>Type: {investment.allocationType === "fixed" ? "Fast beløb" : "Procentdel"}</p>

                        <form action={async () => {
                            "use server";
                            await deleteInvestmentAllocation(investment.id);
                        }}>
                            <button type="submit" className="text-red-500 text-sm ml-2">Slet</button>
                        </form>
                    </li>
                ))}
            </ul>
            <AddInvestmentAllocationForm />
        </div >
    );
}