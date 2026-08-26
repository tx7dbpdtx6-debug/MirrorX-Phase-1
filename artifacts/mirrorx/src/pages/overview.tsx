import { useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, ChevronRight, RefreshCw, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { useGetDashboard, useGetTransactions, useGetWalletBalances } from '@workspace/api-client-react';
import { ChainGlyph, EmptyState, ErrorState, LoadingPanel, Money, PageHeading, Panel, Shell, StatusPill, TypeIcon } from '@/components/mirrorx-ui';

function PortfolioChart({ points }: { points: { label: string; value: number }[] }) {
  const values = points.map((point) => point.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const width = 720;
  const height = 180;
  const path = points.map((point, index) => {
    const x = points.length <= 1 ? 0 : (index / (points.length - 1)) * width;
    const y = height - ((point.value - min) / Math.max(max - min, 1)) * (height - 22) - 4;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const fill = `${path} L ${width} ${height} L 0 ${height} Z`;
  return <div className="relative mt-5 h-[235px] min-w-0" data-testid="chart-portfolio">
    <div className="absolute inset-x-0 top-0 flex justify-between text-[10px] text-muted-foreground"><span>Portfolio value</span><span className="mono">${(max / 1000).toFixed(1)}k high</span></div>
    <svg className="absolute inset-x-0 bottom-5 top-7 h-[190px] w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Portfolio value over time">
      <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#16c79a" stopOpacity=".22" /><stop offset="100%" stopColor="#16c79a" stopOpacity="0" /></linearGradient></defs>
      <path d={fill} fill="url(#area)" />
      <path d={path} fill="none" stroke="#0cae87" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      {points.map((point, index) => { const x = points.length <= 1 ? 0 : (index / (points.length - 1)) * width; const y = height - ((point.value - min) / Math.max(max - min, 1)) * (height - 22) - 4; return <circle key={point.label} cx={x} cy={y} r="4" fill="#fff" stroke="#0cae87" strokeWidth="2" vectorEffect="non-scaling-stroke" />; })}
    </svg>
    <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-muted-foreground">{points.map((point) => <span key={point.label}>{point.label}</span>)}</div>
  </div>;
}

export default function Overview() {
  const dashboard = useGetDashboard();
  const wallets = useGetWalletBalances();
  const transactions = useGetTransactions({ limit: 5 });
  const isLoading = dashboard.isLoading || wallets.isLoading || transactions.isLoading;
  const hasError = dashboard.isError || wallets.isError || transactions.isError;
  const chart = useMemo(() => dashboard.data?.chart ?? [], [dashboard.data?.chart]);
  const refresh = () => { void dashboard.refetch(); void wallets.refetch(); void transactions.refetch(); };

  return <Shell><PageHeading eyebrow="Tuesday · 14 May 2024" title="Good morning, Ari." detail="Here’s the shape of your capital today." action={<button type="button" onClick={refresh} data-testid="button-refresh-overview" className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs font-medium text-muted-foreground transition hover:border-[#83d9c1] hover:text-primary"><RefreshCw size={14} /> Sync now</button>} />
    {hasError ? <ErrorState onRetry={refresh} /> : isLoading ? <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><Panel className="h-[370px] p-6"><LoadingPanel rows={4} /></Panel><Panel className="h-[370px] p-6"><LoadingPanel rows={4} /></Panel></div> : <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <Panel className="surface-grid relative overflow-hidden bg-[#123749] p-6 text-[#e9f7f0] sm:p-7" testId="card-total-balance">
          <div className="absolute -right-14 -top-20 size-64 rounded-full border-[24px] border-[#36d2ae]/10" /><div className="absolute -bottom-20 right-14 size-48 rounded-full border-[18px] border-[#b9f25b]/10" />
          <div className="relative flex items-start justify-between"><div><p className="text-[11px] uppercase tracking-[.18em] text-[#93b5ad]">Total balance</p><p className="mt-4 text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-none tracking-[-.07em]" data-testid="text-total-balance"><Money value={dashboard.data?.totalBalanceUsd ?? 0} /></p><div className="mt-5 flex flex-wrap items-center gap-3 text-sm"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#b9f25b] px-2.5 py-1 font-semibold text-[#123749]"><TrendingUp size={14} /> +{dashboard.data?.profitPercent ?? 0}%</span><span className="text-[#a9c4bd]">this month</span></div></div><div className="grid size-12 place-items-center rounded-2xl bg-[#b9f25b] text-[#123749]"><Zap size={21} /></div></div>
          <div className="relative mt-12 grid grid-cols-3 border-t border-[#518071]/35 pt-4"><div><p className="text-[10px] uppercase tracking-[.12em] text-[#83a9a0]">Net profit</p><p className="mono mt-1.5 text-sm text-[#e9f7f0]" data-testid="text-net-profit">+<Money value={dashboard.data?.totalProfitUsd ?? 0} /></p></div><div><p className="text-[10px] uppercase tracking-[.12em] text-[#83a9a0]">Positions</p><p className="mono mt-1.5 text-sm text-[#e9f7f0]" data-testid="text-active-positions">{dashboard.data?.activePositions ?? 0} active</p></div><div><p className="text-[10px] uppercase tracking-[.12em] text-[#83a9a0]">Account</p><p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#b9f25b]" data-testid="status-account"><ShieldCheck size={14} /> {dashboard.data?.accountStatus?.toLowerCase() ?? 'pending'}</p></div></div>
        </Panel>
        <Panel className="p-6 sm:p-7" testId="card-referral-callout"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">Referral pulse</p><Link href="/referrals" data-testid="link-view-referrals" className="text-muted-foreground transition hover:text-primary"><ArrowUpRight size={17} /></Link></div><p className="mt-7 text-3xl font-semibold tracking-[-.06em]" data-testid="text-referral-code">{dashboard.data?.referralCode ?? '—'}</p><p className="mt-1 text-sm text-muted-foreground">Your active invite code</p><div className="my-6 h-px bg-border" /><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.14em] text-muted-foreground">Status</p><p className="mt-1 text-sm font-medium text-[#0a9977]">Earning rewards</p></div><Link href="/referrals" data-testid="link-manage-referrals" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Manage <ChevronRight size={13} /></Link></div></Panel>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <Panel className="p-6 sm:p-7" testId="card-performance"><div className="flex items-start justify-between"><div><p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">Performance</p><h2 className="mt-1 text-lg font-semibold tracking-[-.03em]">Portfolio movement</h2></div><span className="rounded-lg bg-secondary px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">Last 7 months</span></div>{chart.length ? <PortfolioChart points={chart} /> : <EmptyState label="Chart is warming up" detail="Portfolio history will appear after your first activity." />}</Panel>
        <Panel className="p-6 sm:p-7" testId="card-wallet-snapshot"><div className="flex items-center justify-between"><div><p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">Allocation</p><h2 className="mt-1 text-lg font-semibold tracking-[-.03em]">Wallet snapshot</h2></div><Link href="/wallets" data-testid="link-view-wallets" className="text-muted-foreground hover:text-primary"><ChevronRight size={17} /></Link></div><div className="mt-6 space-y-4">{wallets.data?.length ? wallets.data.slice(0, 3).map((wallet) => <div key={wallet.id} className="flex items-center gap-3" data-testid={`row-wallet-snapshot-${wallet.id}`}><ChainGlyph chain={wallet.chain} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><span className="text-sm font-medium">{wallet.chain}</span><span className="mono text-xs"><Money value={wallet.usdValue} /></span></div><div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground"><span>{wallet.amount.toLocaleString()} {wallet.symbol}</span><span className={wallet.changePercent >= 0 ? 'text-[#0b9979]' : 'text-[#b5554c]'}>{wallet.changePercent >= 0 ? '+' : ''}{wallet.changePercent}%</span></div><div className="mt-2 h-1 rounded-full bg-secondary"><div className="h-1 rounded-full bg-[#14c9a0]" style={{ width: `${Math.min(100, Math.max(8, wallet.usdValue / Math.max(...(wallets.data ?? []).map((w) => w.usdValue), 1) * 100))}%` }} /></div></div></div>) : <EmptyState label="No wallets connected" detail="Your multi-chain balances will show here." />}</div></Panel>
      </div>
      <Panel className="overflow-hidden" testId="card-recent-activity"><div className="flex items-center justify-between border-b border-border px-6 py-5 sm:px-7"><div><p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">Ledger</p><h2 className="mt-1 text-lg font-semibold tracking-[-.03em]">Recent activity</h2></div><Link href="/transactions" data-testid="link-view-transactions" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">All activity <ChevronRight size={13} /></Link></div>{transactions.data?.length ? <div className="divide-y divide-border">{transactions.data.slice(0, 4).map((transaction) => <div key={transaction.id} className="flex items-center gap-3 px-6 py-4 sm:px-7" data-testid={`row-recent-transaction-${transaction.id}`}><TypeIcon type={transaction.type} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{transaction.type.replace('_', ' ').toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase())}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div><div className="text-right"><p className="mono text-sm font-medium">{transaction.type === 'WITHDRAWAL' ? '-' : '+'}{transaction.amount} {transaction.currency}</p><div className="mt-1"><StatusPill status={transaction.status} /></div></div></div>)}</div> : <div className="p-5"><EmptyState label="No recent activity" detail="Deposits and withdrawals will land here." /></div>}</Panel>
    </div>}
  </Shell>;
}