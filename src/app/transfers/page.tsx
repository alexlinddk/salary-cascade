import { TransferItem } from "@/db/schema";
import { toggleTransferItem } from "@/lib/actions";
import { getTransferItems } from "@/lib/data";
import { getCurrentMonth } from "@/lib/cascade";

export default async function TransfersPage() {
    const month = getCurrentMonth();
    const snapshot = await getTransferItems(month);
    const transfers = snapshot?.transferItems ?? [];

    console.log("Looking for month:", month);
    console.log("Snapshot found:", snapshot);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Overførsler</h1>
            <p>Her kan du se alle dine overførsler for denne måned, både automatiske og manuelle.</p>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Automatiske overførsler</h2>
                <p>Disse overførsler er håndteret automatisk via betalingsservice.</p>
                <ul className="mt-4 space-y-2">
                    {transfers.filter(t => t.type === "auto").map((transfer: TransferItem) => (
                        <li key={transfer.id} className="border rounded p-4">
                            <h3 className="text-lg font-semibold">{transfer.name}</h3>
                            <p>Beløb: {transfer.amount} DKK</p>
                            <p>Status: {transfer.isCompleted ? "Betalt" : "Afventer"}</p>
                            <form action={async () => {
                                "use server";
                                await toggleTransferItem(transfer.id, !transfer.isCompleted);
                            }}>
                                <button type="submit" className="text-sm">
                                    {transfer.isCompleted ? "✅ Betalt" : "☐ Marker som betalt"}
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Manuelle overførsler</h2>
                <p>Disse overførsler skal du selv håndtere. Marker dem som betalt, når du har gennemført dem.</p>
                <ul className="mt-4 space-y-2">
                    {transfers.filter(t => t.type === "manual").map((transfer: TransferItem) => (
                        <li key={transfer.id} className="border rounded p-4">
                            <h3 className="text-lg font-semibold">{transfer.name}</h3>
                            <p>Beløb: {transfer.amount} DKK</p>
                            <p>Status: {transfer.isCompleted ? "Betalt" : "Afventer"}</p>
                            <form action={async () => {
                                "use server";
                                await toggleTransferItem(transfer.id, !transfer.isCompleted);
                            }}>
                                <button type="submit" className="text-sm">
                                    {transfer.isCompleted ? "✅ Betalt" : "☐ Marker som betalt"}
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Betalt via kort</h2>
                <p>Disse overførsler er betalt via kort. De håndteres manuelt
                    og kan markeres som betalt, når du har gennemført dem.</p>
                {transfers.filter(t => t.type === "card").length === 0 ? (
                    <p className="text-gray-500 mt-4">Ingen overførsler betalt via kort denne måned.</p>
                ) : (
                    <ul className="mt-4 space-y-2">
                        {transfers.filter(t => t.type === "card").map((transfer: TransferItem) => (
                            <li key={transfer.id} className="border rounded p-4">
                                <h3 className="text-lg font-semibold">{transfer.name}</h3>
                                <p>Beløb: {transfer.amount} DKK</p>
                                <p>Status: {transfer.isCompleted ? "Betalt" : "Afventer"}</p>
                                <form action={async () => {
                                    "use server";
                                    await toggleTransferItem(transfer.id, !transfer.isCompleted);
                                }}>
                                    <button type="submit" className="text-sm">
                                        {transfer.isCompleted ? "✅ Betalt" : "☐ Marker som betalt"}
                                    </button>
                                </form>
                            </li>
                        ))}

                    </ul>
                )}
            </div>
        </div>
    );
}