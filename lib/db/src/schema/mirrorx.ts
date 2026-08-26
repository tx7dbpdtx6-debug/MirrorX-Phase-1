import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const kycStatusEnum = pgEnum("kyc_status", [
  "UNVERIFIED",
  "PENDING",
  "VERIFIED",
]);
export const chainEnum = pgEnum("chain", ["SOL", "BTC", "ETH"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "DEPOSIT",
  "WITHDRAWAL",
  "PROFIT_ADDITION",
  "ADJUSTMENT",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "PENDING",
  "APPROVED",
  "COMPLETED",
  "REJECTED",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  telegramId: text("telegram_id"),
  depositMemo: text("deposit_memo").notNull().unique(),
  passwordHash: text("password_hash"),
  role: roleEnum("role").notNull().default("USER"),
  kycStatus: kycStatusEnum("kyc_status").notNull().default("UNVERIFIED"),
  isBanned: boolean("is_banned").notNull().default(false),
  referralCode: text("referral_code").notNull().unique(),
  referredById: uuid("referred_by_id"),
  connectedWallet: text("connected_wallet"),
  stopLossPercent: decimal("stop_loss_percent", {
    precision: 6,
    scale: 2,
  })
    .notNull()
    .default("15"),
  takeProfitPercent: decimal("take_profit_percent", {
    precision: 6,
    scale: 2,
  })
    .notNull()
    .default("50"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const walletBalancesTable = pgTable("wallet_balances", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  chain: chainEnum("chain").notNull(),
  amount: decimal("amount", { precision: 30, scale: 12 })
    .notNull()
    .default("0"),
});

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 30, scale: 12 }).notNull(),
  currency: text("currency").notNull(),
  txHash: text("tx_hash"),
  receiptUrl: text("receipt_url"),
  aiBreakdown: text("ai_breakdown"),
  status: transactionStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const paymentReceiptsTable = pgTable("payment_receipts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  txHash: text("tx_hash").notNull(),
  imageUrl: text("image_url"),
  status: transactionStatusEnum("status").notNull().default("PENDING"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const systemSettingsTable = pgTable("system_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const referralsTable = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  referrerId: uuid("referrer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  refereeId: uuid("referee_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  volumeTraded: decimal("volume_traded", { precision: 30, scale: 12 })
    .notNull()
    .default("0"),
  rewardsEarnedSol: decimal(
    "rewards_earned_sol",
    { precision: 30, scale: 12 },
  )
    .notNull()
    .default("0"),
  unpaidRewardsSol: decimal("unpaid_rewards_sol", {
    precision: 30,
    scale: 12,
  })
    .notNull()
    .default("0"),
});

export const auditLogsTable = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
});
export const insertWalletBalanceSchema = createInsertSchema(
  walletBalancesTable,
).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(
  transactionsTable,
).omit({ id: true, createdAt: true });
export const insertPaymentReceiptSchema = createInsertSchema(
  paymentReceiptsTable,
).omit({ id: true, submittedAt: true });
export const insertSystemSettingSchema = createInsertSchema(
  systemSettingsTable,
).omit({ updatedAt: true });
export const insertReferralSchema = createInsertSchema(referralsTable).omit({
  id: true,
});
export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type WalletBalance = typeof walletBalancesTable.$inferSelect;
export type Transaction = typeof transactionsTable.$inferSelect;
export type PaymentReceipt = typeof paymentReceiptsTable.$inferSelect;
export type SystemSetting = typeof systemSettingsTable.$inferSelect;
export type Referral = typeof referralsTable.$inferSelect;
export type AuditLog = typeof auditLogsTable.$inferSelect;