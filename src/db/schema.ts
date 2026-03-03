
import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    integer,
    boolean,
    numeric,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const allocationTypeEnum = pgEnum("allocation_type", [
    "fixed",
    "percentage",
]);

export const incomeSources = pgTable("income_sources", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    expectedAmount: numeric("expected_amount", { precision: 10, scale: 2 }).notNull(), payDay: integer("pay_day").notNull(),
    isRecurring: boolean("is_recurring").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tiers = pgTable("tiers", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    priority: integer("priority").notNull(),
    color: text("color").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    tierId: text("tier_id")
        .notNull()
        .references(() => tiers.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    isFixed: boolean("is_fixed").notNull().default(true),
    category: text("category").notNull(),
    dueDate: integer("due_date"),
    isAutoPaid: boolean("is_auto_paid").notNull().default(false),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tiersRelations = relations(tiers, ({ many }) => ({
    expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
    tier: one(tiers, {
        fields: [expenses.tierId],
        references: [tiers.id],
    }),
}));

export const savingsGoals = pgTable("savings_goals", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    targetAmount: numeric("target_amount", { precision: 10, scale: 2 }).notNull(),
    currentAmount: numeric("current_amount", { precision: 10, scale: 2 }).notNull().default("0"),
    monthlyContribution: numeric("monthly_contribution", { precision: 10, scale: 2 }).notNull().default("0" ),
    deadline: text("deadline"),
    priority: integer("priority").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const investmentAllocations = pgTable("investment_allocations", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    allocationType: allocationTypeEnum("allocation_type").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    broker: text("broker"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const monthlySnapshots = pgTable("monthly_snapshots", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    month: text("month").notNull().unique(),
    totalIncome: numeric("total_income", { precision: 10, scale: 2 }).notNull(),
    savingsAllocated: numeric("savings_allocated", { precision: 10, scale: 2 }).notNull().default("0"),
    investmentsAllocated: numeric("investments_allocated", { precision: 10, scale: 2 }).notNull().default("0"),
    freeMoney: numeric("free_money", { precision: 10, scale: 2 }).notNull().default("0"),
    freeMoneySpent: numeric("free_money_spent", { precision: 10, scale: 2 }).notNull().default("0"),
    isConfirmed: boolean("is_confirmed").notNull().default(false),
    confirmedAt: timestamp("confirmed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const snapshotTierAllocations = pgTable("snapshot_tier_allocations", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    snapshotId: text("snapshot_id")
        .notNull()
        .references(() => monthlySnapshots.id, { onDelete: "cascade" }),
    tierId: text("tier_id")
        .references(() => tiers.id),
    tierName: text("tier_name").notNull(),
    requested: numeric("requested", { precision: 10, scale: 2 }).notNull(),
    allocated: numeric("allocated", { precision: 10, scale: 2 }).notNull(),
    fullyFunded: boolean("fully_funded").notNull().default(false),
    shortfall: numeric("shortfall", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const transferItems = pgTable("transfer_items", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    snapshotId: text("snapshot_id")
        .notNull()
        .references(() => monthlySnapshots.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    type: text("type").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at"),
});

export const spendingEntries = pgTable("spending_entries", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    snapshotId: text("snapshot_id")
        .notNull()
        .references(() => monthlySnapshots.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    date: timestamp("date").notNull().defaultNow(),
    category: text("category").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const monthlySnapshotRelations = relations(
    monthlySnapshots,
    ({ many }) => ({
        tierAllocations: many(snapshotTierAllocations),
        transferItems: many(transferItems),
        spendingEntries: many(spendingEntries),
    })
);

export const snapshotTierAllocationsRelations = relations(
    snapshotTierAllocations,
    ({ one }) => ({
        snapshot: one(monthlySnapshots, {
            fields: [snapshotTierAllocations.snapshotId],
            references: [monthlySnapshots.id],
        }),
    })
);

export const transferItemsRelations = relations(
    transferItems,
    ({ one }) => ({
        snapshot: one(monthlySnapshots, {
            fields: [transferItems.snapshotId],
            references: [monthlySnapshots.id],
        }),
    })
);

export const spendingEntriesRelations = relations(
    spendingEntries,
    ({ one }) => ({
        snapshot: one(monthlySnapshots, {
            fields: [spendingEntries.snapshotId],
            references: [monthlySnapshots.id],
        }),
    })
);

export type IncomeSource = typeof incomeSources.$inferSelect;
export type Tier = typeof tiers.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type InvestmentAllocation = typeof investmentAllocations.$inferSelect;
export type MonthlySnapshot = typeof monthlySnapshots.$inferSelect;
export type SnapshotTierAllocation = typeof snapshotTierAllocations.$inferSelect;
export type TransferItem = typeof transferItems.$inferSelect;
export type SpendingEntry = typeof spendingEntries.$inferSelect;