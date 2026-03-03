import { describe, it, expect } from "vitest";
import { cascade } from "@/lib/cascade";

describe("cascade", () => {
    it("distributes a normal salary correctly", () => {
        const result = cascade(
            0,
            [
                {
                    id: "t1",
                    name: "Faste Udgifter",
                    priority: 1,
                    items: [
                        { id: "e1", name: "Fagforening", amount: 685 },
                        { id: "e2", name: "Studiegæld", amount: 2161 },
                        { id: "e3", name: "Fitness", amount: 315 },
                        { id: "e4", name: "Youtube Premium", amount: 179 },
                        { id: "e5", name: "Netflix", amount: 99 },
                    ],
                },
                {
                    id: "t2",
                    name: "Variable Udgifter",
                    priority: 2,
                    items: [
                        { id: "e11", name: "Frisør", amount: 229 },
                    ],
                },
            ],
            [
                {
                    id: "s1",
                    name: "Feriefond",
                    monthlyContribution: 1000,
                    priority: 1,
                    targetAmount: 12000,
                    currentAmount: 4000,
                },
            ],
            [
                {
                    id: "i1",
                    name: "Aktier",
                    allocationType: "fixed",
                    amount: 1000,
                },
            ]
        );

        expect(result.tierAllocations[0].fullyFunded).toBe(false);
        expect(result.tierAllocations[0].allocated).toBe(0);
        expect(result.tierAllocations[1].allocated).toBe(0);
        expect(result.savingsAllocated).toBe(0);
        expect(result.investmentsAllocated).toBe(0);
        expect(result.freeMoney).toBe(0);
        expect(result.warnings.length).toBeGreaterThan(0);
    });
});