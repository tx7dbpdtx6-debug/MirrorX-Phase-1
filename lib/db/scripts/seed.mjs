import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to run the seed script.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const PREVIEW_EMAIL = "admin@mirrorx.io";

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Upsert the preview admin user the API expects.
    const userResult = await client.query(
      `INSERT INTO users (email, is_email_verified, deposit_memo, role, kyc_status, referral_code, stop_loss_percent, take_profit_percent)
       VALUES ($1, true, $2, 'ADMIN', 'VERIFIED', $3, '15', '50')
       ON CONFLICT (email) DO UPDATE SET
         is_email_verified = EXCLUDED.is_email_verified,
         role = EXCLUDED.role,
         kyc_status = EXCLUDED.kyc_status
       RETURNING id`,
      [PREVIEW_EMAIL, "MEMO-MIRRORX-0001", "MIRRORX-ADMIN"],
    );
    const userId = userResult.rows[0].id;

    // Reset dependent rows so re-running the seed is idempotent.
    await client.query(`DELETE FROM wallet_balances WHERE user_id = $1`, [userId]);
    await client.query(`DELETE FROM transactions WHERE user_id = $1`, [userId]);
    await client.query(`DELETE FROM referrals WHERE referrer_id = $1`, [userId]);

    // Wallet balances across the three supported chains.
    const balances = [
      ["SOL", "82.4"],
      ["BTC", "0.213"],
      ["ETH", "6.05"],
    ];
    for (const [chain, amount] of balances) {
      await client.query(
        `INSERT INTO wallet_balances (user_id, chain, amount) VALUES ($1, $2, $3)`,
        [userId, chain, amount],
      );
    }

    // Recent transaction history.
    const transactions = [
      ["DEPOSIT", "40", "SOL", "COMPLETED", "0xdep0s1t01"],
      ["PROFIT_ADDITION", "6.2", "SOL", "COMPLETED", null],
      ["WITHDRAWAL", "0.05", "BTC", "PENDING", "0xw1thdr4w02"],
      ["DEPOSIT", "3.0", "ETH", "APPROVED", "0xdep0s1t03"],
    ];
    for (const [type, amount, currency, status, txHash] of transactions) {
      await client.query(
        `INSERT INTO transactions (user_id, type, amount, currency, status, tx_hash) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, type, amount, currency, status, txHash],
      );
    }

    // Referral summary row.
    await client.query(
      `INSERT INTO referrals (referrer_id, referee_id, volume_traded, rewards_earned_sol, unpaid_rewards_sol)
       VALUES ($1, $1, '12400', '18.6', '4.2')`,
      [userId],
    );

    // Public system settings.
    const settings = [
      ["app_name", "MirrorX"],
      ["support_handle", "METEORA_guard"],
      ["min_withdrawal_sol", "25"],
      ["min_withdrawal_btc", "0.031"],
      ["min_withdrawal_eth", "0.98"],
      ["withdrawal_fee_percentage", "10"],
    ];
    for (const [key, value] of settings) {
      await client.query(
        `INSERT INTO system_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, value],
      );
    }

    await client.query("COMMIT");
    console.log("[seed] Seeded preview user", userId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[seed] Failed:", error);
  process.exit(1);
});
