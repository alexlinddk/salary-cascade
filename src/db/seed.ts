import { db } from "./index";
import {
    incomeSources,
    tiers,
    expenses,
    savingsGoals,
    investmentAllocations,
} from "./schema";

async function seed() {
    console.log("🌱 Seeding database...");

    await db.delete(expenses);
    await db.delete(tiers);
    await db.delete(incomeSources);
    await db.delete(savingsGoals);
    await db.delete(investmentAllocations);

    await db.insert(incomeSources).values({
        name: "Løn",
        expectedAmount: "16077.00",
        payDay: 28,
        isRecurring: true,
    });

    const [tier1] = await db.insert(tiers).values({
        name: "Faste Udgifter",
        priority: 1,
        color: "#FF6B6B",
        emoji: "🏠",
    }).returning();

    const [tier2] = await db.insert(tiers).values({
        name: "Variable Udgifter",
        priority: 2,
        color: "#4ECDC4",
        emoji: "💸",
    }).returning();

    await db.insert(expenses).values([{
        tierId: tier1.id,
        name: "Fagforening - Prosa",
        amount: "685.00",
        isFixed: true,
        category: "Fagforening",
        dueDate: 2,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    }, {
        tierId: tier1.id,
        name: "Studiegæld",
        amount: "2161.00",
        isFixed: true,
        category: "Gæld",
        dueDate: 1,
        isAutoPaid: true,
        notes: "Betalt via BudgetKonto",
    },
    {
        tierId: tier1.id,
        name: "Fitness X",
        amount: "315.00",
        isFixed: true,
        category: "Abonnement",
        dueDate: 5,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    {
        tierId: tier1.id,
        name: "Youtube Premium",
        amount: "179.00",
        isFixed: true,
        category: "Abonnement",
        dueDate: 15,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    {
        tierId: tier1.id,
        name: "MBC Shahid",
        amount: "97.00",
        isFixed: true,
        category: "Abonnement",
        dueDate: 1,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
{
        tierId: tier1.id,
        name: "Instagram",
        amount: "59.00",
        isFixed: true,
        category: "Abonnement",
        dueDate: 15,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    {
        tierId: tier1.id,
        name: "iCloud",
        amount: "9.00",
        isFixed: true,
        category: "Abonnement",
        dueDate: 15,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    {
        tierId: tier1.id,
        name: "Crunchyroll",
        amount: "79.00",
        isFixed: true,
        category: "Abonnement",
        dueDate: 15,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    {
        tierId: tier1.id,
        name: "Anthropic AI",
        amount: "169.79",
        isFixed: true,
        category: "Abonnement",
        dueDate: 15,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    {
        tierId: tier1.id,
        name: "Telenor",
        amount: "269.00",
        isFixed: true,
        category: "Abonnement",
        dueDate: 15,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    {
        tierId: tier2.id,
        name: "Frisør",
        amount: "229.00",
        isFixed: true,
        category: "Personlig Pleje",
        dueDate: 15,
        isAutoPaid: true,
        notes: "Betales via BudgetKonto",
    },
    ]);

    await db.insert(savingsGoals).values([{
        name: "Nødfond",
        targetAmount: "30000.00",
        currentAmount: "30000.00",
        monthlyContribution: "0",
        deadline: null,
        priority: 1,
        emoji: "🛟"
        }, {
        name: "Rejse til Japan",
        targetAmount: "30000.00",
        currentAmount: "13000.00",
        monthlyContribution: "1000.00",
        deadline: "2025-04-20",
        priority: 2,
        emoji: "✈️"
    }]);

    await db.insert(investmentAllocations).values({
        name: "Aktier",
        amount: "1000.00",
        allocationType: "fixed",
        broker: "Nordnet",
    });


    console.log("✅ Seed complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});