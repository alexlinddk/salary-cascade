import { confirmIncome } from "@/lib/actions";
import { redirect } from "next/navigation";

export default function ConfirmPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Bekræft indkomst</h1>
            <p>Indtast din faktiske indkomst for måneden for at se, hvordan den fordeles i dine tiers, opsparing og investeringer.</p>
            <form action={async (formData: FormData) => {
                "use server";
                const month = formData.get("month") as string;
                const actualIncome = formData.get("actualIncome") as string;
                await confirmIncome(month, actualIncome);
            }}>
                <div className="mt-4">
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700">Måned</label>
                    <input type="month" name="month" id="month" className="mt-1 block w-full border rounded px-3 py-2" required />
                </div>
                <div className="mt-4">
                    <label htmlFor="actualIncome" className="block text-sm font-medium text-gray-700">Faktisk indkomst</label>
                    <input type="number" name="actualIncome" id="actualIncome" className="mt-1 block w-full border rounded px-3 py-2" required />
                </div>
                <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Bekræft</button>
            </form>
        </div>
    );
}