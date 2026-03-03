export type CascadeTier = {
    id: string;
    name: string;
    priority: number;
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
    items: { itemId: string; itemName: string; amount: number }[];
};

export type CascadeResult = {
    totalIncome: number;
    tierAllocations: TierAllocation[];
    savingsDetails: SavingsAllocationDetail[];
    savingsAllocated: number;
    investmentDetails: InvestmentAllocationDetail[];
    investmentsAllocated: number;
    freeMoney: number;
    warnings: string[];
};

export type SavingsAllocationDetail = {
    goalId: string;
    goalName: string;
    requested: number;
    allocated: number;
};

export type InvestmentAllocationDetail = {
    investmentId: string;
    investmentName: string;
    requested: number;
    allocated: number;
};

export function formatDKK(amount: number): string {
    return `${amount.toLocaleString("da-DK", { minimumFractionDigits: 2 })} kr.`;
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
            items: sortedTiers[i].items.map((item) => ({
                itemId: item.id,
                itemName: item.name,
                amount: Math.min(item.amount, remaining),
            })),
        });
        remaining -= allocated;
    }

    const savingsDetails: SavingsAllocationDetail[] = [];

    for (let i = 0; i < sortedGoals.length; i++) {
        const savingsGoalAmount = sortedGoals[i].monthlyContribution;
        const remainingToTarget = Math.max(0, sortedGoals[i].targetAmount - sortedGoals[i].currentAmount);
        const needed = Math.min(sortedGoals[i].monthlyContribution, remainingToTarget);
        const allocated = Math.min(needed, remaining);

        if (allocated < savingsGoalAmount) {
            warnings.push(`Sparmål "${sortedGoals[i].name}" er ikke fuldt finansieret. Mangler ${savingsGoalAmount - allocated} kr.`);
        }

        savingsDetails.push({
            goalId: sortedGoals[i].id,
            goalName: sortedGoals[i].name,
            requested: needed,
            allocated,
        });

        savingsAllocated += allocated;
        remaining -= allocated;
    }

    const investmentDetails: InvestmentAllocationDetail[] = [];

    for (let i = 0; i < investments.length; i++) {
        if (investments[i].allocationType === "percentage") {
            const needed = Math.round(remaining * (investments[i].amount / 100));
            investmentsAllocated += needed;
            remaining -= needed;

            investmentDetails.push({
                investmentId: investments[i].id,
                investmentName: investments[i].name,
                requested: needed,
                allocated: needed,
            });
        } else {
            const allocated = Math.min(investments[i].amount, remaining);
            investmentsAllocated += allocated;
            remaining -= allocated;

            investmentDetails.push({
                investmentId: investments[i].id,
                investmentName: investments[i].name,
                requested: investments[i].amount,
                allocated,
            });
        }
    }

    return {
        totalIncome: income,
        tierAllocations,
        savingsDetails,
        savingsAllocated,
        investmentDetails,
        investmentsAllocated,
        freeMoney: remaining,
        warnings,
    };
}