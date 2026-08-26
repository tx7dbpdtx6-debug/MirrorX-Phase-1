import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  DashboardSummary,
  GetDashboardResponse,
  GetPublicSettingsResponse,
  GetReferralSummaryResponse,
  GetTransactionsQueryParams,
  GetTransactionsResponse,
  GetWalletBalancesResponse,
  PublicSettings,
  ReferralSummary,
  Transaction,
  WalletBalance,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  referralsTable,
  systemSettingsTable,
  transactionsTable,
  usersTable,
  walletBalancesTable,
} from "@workspace/db";

const router: IRouter = Router();
const previewUserEmail = "admin@mirrorx.io";
const prices: Record<"SOL" | "BTC" | "ETH", number> = {
  SOL: 146.22,
  BTC: 112480,
  ETH: 3824,
};
const symbols = { SOL: "SOL", BTC: "BTC", ETH: "ETH" } as const;

async function getPreviewUser() {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, previewUserEmail))
    .limit(1);
  if (!user) {
    throw new Error("MirrorX preview user has not been seeded");
  }
  return user;
}

router.get("/dashboard", async (req, res) => {
  try {
    const user = await getPreviewUser();
    const balances = await db
      .select()
      .from(walletBalancesTable)
      .where(eq(walletBalancesTable.userId, user.id));
    const totalBalanceUsd = balances.reduce(
      (total, balance) =>
        total +
        Number(balance.amount) *
          prices[balance.chain as "SOL" | "BTC" | "ETH"],
      0,
    );
    const data = GetDashboardResponse.parse({
      totalBalanceUsd,
      totalProfitUsd: 1842.64,
      profitPercent: 14.8,
      activePositions: 3,
      accountStatus: user.kycStatus,
      referralCode: user.referralCode,
      chart: [
        { label: "Mar 01", value: 9200 },
        { label: "Mar 08", value: 10480 },
        { label: "Mar 15", value: 11840 },
        { label: "Mar 22", value: 12640 },
        { label: "Mar 29", value: totalBalanceUsd },
      ],
    });
    res.json(data);
  } catch (error) {
    req.log.error({ err: error }, "Failed to load dashboard");
    res.status(500).json({ error: "Unable to load dashboard" });
  }
});

router.get("/wallet-balances", async (req, res) => {
  try {
    const user = await getPreviewUser();
    const balances = await db
      .select()
      .from(walletBalancesTable)
      .where(eq(walletBalancesTable.userId, user.id));
    const data = balances.map((balance) => {
      const chain = balance.chain as "SOL" | "BTC" | "ETH";
      return {
        id: balance.id,
        chain,
        amount: Number(balance.amount),
        symbol: symbols[chain],
        usdValue: Number(balance.amount) * prices[chain],
        changePercent: chain === "BTC" ? 2.1 : chain === "ETH" ? 4.7 : 8.3,
      };
    });
    res.json(GetWalletBalancesResponse.parse(data));
  } catch (error) {
    req.log.error({ err: error }, "Failed to load wallet balances");
    res.status(500).json({ error: "Unable to load wallet balances" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const user = await getPreviewUser();
    const query = GetTransactionsQueryParams.parse(req.query);
    const transactions = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, user.id))
      .orderBy(desc(transactionsTable.createdAt))
      .limit(query.limit ?? 10);
    const data: Transaction[] = transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      status: transaction.status,
      txHash: transaction.txHash,
      createdAt: transaction.createdAt,
    }));
    res.json(GetTransactionsResponse.parse(data));
  } catch (error) {
    req.log.error({ err: error }, "Failed to load transactions");
    res.status(500).json({ error: "Unable to load transactions" });
  }
});

router.get("/referrals", async (req, res) => {
  try {
    const user = await getPreviewUser();
    const [referral] = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.referrerId, user.id))
      .limit(1);
    const data: ReferralSummary = {
      referralCode: user.referralCode,
      invitedCount: referral ? 1 : 0,
      volumeTraded: referral ? Number(referral.volumeTraded) : 0,
      rewardsEarnedSol: referral ? Number(referral.rewardsEarnedSol) : 0,
      unpaidRewardsSol: referral ? Number(referral.unpaidRewardsSol) : 0,
    };
    res.json(GetReferralSummaryResponse.parse(data));
  } catch (error) {
    req.log.error({ err: error }, "Failed to load referrals");
    res.status(500).json({ error: "Unable to load referrals" });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const settings = await db.select().from(systemSettingsTable);
    const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
    const data: PublicSettings = {
      appName: values.app_name ?? "MirrorX",
      supportHandle: values.support_handle ?? "METEORA_guard",
      minWithdrawal: {
        SOL: Number(values.min_withdrawal_sol ?? 25),
        BTC: Number(values.min_withdrawal_btc ?? 0.031),
        ETH: Number(values.min_withdrawal_eth ?? 0.98),
      },
      withdrawalFeePercentage: Number(values.withdrawal_fee_percentage ?? 10),
    };
    res.json(GetPublicSettingsResponse.parse(data));
  } catch (error) {
    req.log.error({ err: error }, "Failed to load public settings");
    res.status(500).json({ error: "Unable to load public settings" });
  }
});

export default router;