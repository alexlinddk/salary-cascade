export type CascadeTier = {
    id: string;
    name: string;
    priority: number;
    emoji: string;
    items: { id: string; name: string; amount: number }[];
};

export type CascadeSavingsGoal = {
    id: string;
    name: string;
    monthlyContribution: number;
    priority: number;
    targetAmount: number;
    currentAmount: number;
};

export type CascadeInvestment = {
    id: string;
    name: string;
    allocationType: "fixed" | "percentage";
    amount: number;
};

export type TierAllocation = {
    tierId: string;
    tierName: string;
    requested: number;
    allocated: number;
    fullyFunded: boolean;
    shortfall: number;
    tierEmoji: string;
    items: { itemId: string; itemName: string; amount: number }[];
};

export type CascadeResult = {
    totalIncome: number;
    tierAllocations: TierAllocation[];
    savingsAllocated: number;
    investmentsAllocated: number;
    freeMoney: number;
    warnings: string[];
};

export function formatDKK(amount: number): string {
    return `${amount.toLocaleString("da-DK", { minimumFractionDigits: 2 })} kr.`;
}

export function cascade(
    income: number,
    tiers: CascadeTier[],
    savingsGoals: CascadeSavingsGoal[],
    investments: CascadeInvestment[]
): CascadeResult {
    let remaining = income;
    const warnings: string[] = [];
    const tierAllocations: TierAllocation[] = [];
    let savingsAllocated = 0;
    let investmentsAllocated = 0;

    const sortedTiers = [...tiers].sort((a, b) => a.priority - b.priority);
    const sortedGoals = [...savingsGoals].sort((a, b) => a.priority - b.priority);

    for (let i = 0; i < sortedTiers.length; i++) {
        const tierAmount = sortedTiers[i].items.reduce((sum, item) => sum + item.amount, 0);
        const allocated = Math.min(tierAmount, remaining);

        if (allocated < tierAmount) {
            warnings.push(`Tier "${sortedTiers[i].name}" er ikke fuldt finansieret. Mangler ${tierAmount - allocated} kr.`);
        }

        tierAllocations.push({
            tierId: sortedTiers[i].id,
            tierName: sortedTiers[i].name,
            requested: tierAmount,
            allocated,
            fullyFunded: allocated === tierAmount,
            shortfall: tierAmount - allocated,
            tierEmoji: sortedTiers[i].emoji,
            items: sortedTiers[i].items.map((item) => ({
                itemId: item.id,
                itemName: item.name,
                amount: Math.min(item.amount, remaining),
            })),
        });
        remaining -= allocated;
    }

    for (let i = 0; i < savingsGoals.length; i++) {
        const savingsGoalAmount = sortedGoals[i].monthlyContribution;
        const remainingToTarget = Math.max(0, sortedGoals[i].targetAmount - sortedGoals[i].currentAmount);
        const needed = Math.min(sortedGoals[i].monthlyContribution, remainingToTarget);
        const allocated = Math.min(needed, remaining);

        if (allocated < savingsGoalAmount) {
            warnings.push(`Sparmål "${sortedGoals[i].name}" er ikke fuldt finansieret. Mangler ${savingsGoalAmount - allocated} kr.`);
        }

        savingsAllocated += allocated;
        remaining -= allocated;
    }

    for (let i = 0; i < investments.length; i++) {
        if (investments[i].allocationType === "percentage") {
            const needed = Math.round(remaining * (investments[i].amount / 100));
            const allocated = needed;
            investmentsAllocated += allocated;
            remaining -= allocated;
        } else {
            const allocated = Math.min(investments[i].amount, remaining);
            investmentsAllocated += allocated;
            remaining -= allocated;
        }
    }

    return {
        totalIncome: income,
        tierAllocations,
        savingsAllocated,
        investmentsAllocated,
        freeMoney: remaining,
        warnings,
    };
}