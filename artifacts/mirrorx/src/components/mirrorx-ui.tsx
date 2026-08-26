import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Bitcoin,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Share2,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import { MirrorXLogo } from '@/components/MirrorXLogo';

export const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/wallets', label: 'Wallets', icon: WalletCards },
  { href: '/transactions', label: 'Activity', icon: BarChart3 },
  { href: '/referrals', label: 'Referrals', icon: Share2 },
];

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="noise min-h-[100dvh] bg-background">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex ${collapsed ? 'w-[82px]' : 'w-[246px]'}`}>
        <div className={`flex h-[84px] items-center border-b border-sidebar-border ${collapsed ? 'justify-center' : 'px-7'}`}>
          <MirrorXLogo compact={collapsed} />
        </div>
        <div className={`flex flex-1 flex-col ${collapsed ? 'px-3' : 'px-4'}`}>
          <p className={`mb-3 mt-8 text-[10px] font-medium uppercase tracking-[.2em] text-[#6f908f] ${collapsed ? 'text-center' : 'px-3'}`}>{collapsed ? 'MX' : 'Command center'}</p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase()}`} className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200 ${active ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-[inset_3px_0_0_#b9f25b]' : 'text-sidebar-foreground hover:bg-[#193443] hover:text-[#e7f2ee]'} ${collapsed ? 'justify-center px-0' : ''}`}>
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && active && <span className="ml-auto size-1.5 rounded-full bg-[#b9f25b] animate-dot" />}
                </Link>
              );
            })}
          </nav>
          <div className={`mt-auto mb-4 rounded-2xl border border-[#294652] bg-[#173441] p-3.5 ${collapsed ? 'border-transparent bg-transparent p-0' : ''}`}>
            {collapsed ? (
              <div className="mx-auto grid size-9 place-items-center rounded-xl bg-[#b9f25b] text-xs font-bold text-[#102d3e]">A</div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[.18em] text-[#82a6a0]">Your access</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#b9f25b]"><span className="size-1.5 rounded-full bg-[#b9f25b] animate-dot" /> Secure</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#b9f25b] text-xs font-bold text-[#102d3e]">A</div>
                  <div className="min-w-0"><p className="truncate text-xs font-medium text-[#e7f2ee]">Ari M.</p><p className="mono truncate text-[10px] text-[#82a6a0]">0x74...e91b</p></div>
                  <ChevronRight size={14} className="ml-auto text-[#678783]" />
                </div>
              </>
            )}
          </div>
        </div>
        <div className={`border-t border-sidebar-border p-4 ${collapsed ? 'px-3' : ''}`}>
          <Link href="/settings" data-testid="link-nav-settings" className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-sidebar-foreground hover:bg-[#193443] hover:text-[#e7f2ee] ${location === '/settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''} ${collapsed ? 'justify-center px-0' : ''}`}>
            <Settings size={17} />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button type="button" onClick={() => setCollapsed(!collapsed)} data-testid="button-collapse-sidebar" className={`mt-1 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-[#82a6a0] hover:bg-[#193443] hover:text-[#e7f2ee] ${collapsed ? 'justify-center px-0' : ''}`}>
            {collapsed ? <PanelLeftOpen size={17} /> : <><PanelLeftClose size={17} /><span>Collapse menu</span></>}
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-[#102d3e]/45 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-sidebar shadow-2xl transition-transform duration-300 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[84px] items-center justify-between border-b border-sidebar-border px-6"><MirrorXLogo /><button type="button" onClick={() => setOpen(false)} data-testid="button-close-menu" className="text-[#82a6a0]"><X size={19} /></button></div>
        <nav className="space-y-1.5 px-4 pt-8">{navItems.concat({ href: '/settings', label: 'Settings', icon: Settings }).map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} data-testid={`link-mobile-nav-${item.label.toLowerCase()}`} className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm ${location === item.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-[#193443]'}`}><Icon size={17} /><span>{item.label}</span></Link>; })}</nav>
      </aside>

      <main className={`min-h-[100dvh] transition-[padding] duration-300 lg:pl-[246px] ${collapsed ? 'lg:pl-[82px]' : ''}`}>
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <button type="button" onClick={() => setOpen(true)} data-testid="button-open-menu" className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground lg:hidden"><Menu size={18} /></button>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="size-1.5 rounded-full bg-[#14c9a0] animate-dot" /> Live portfolio data <span className="mx-1 text-border">/</span> <span className="mono text-[11px]">UTC 14:32:08</span></div>
          <div className="ml-auto flex items-center gap-2.5">
            <button type="button" data-testid="button-help" className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-[#85d9c1] hover:text-foreground"><CircleHelp size={17} /></button>
            <Link href="/settings" data-testid="link-header-settings" className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-[#85d9c1] hover:text-foreground"><Settings size={17} /></Link>
            <div className="ml-1 hidden h-8 w-px bg-border sm:block" />
            <div className="grid size-9 place-items-center rounded-xl bg-[#b9f25b] text-xs font-bold text-[#102d3e]">AM</div>
          </div>
        </header>
        <div className="mx-auto max-w-[1480px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">{children}</div>
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-30 flex h-[62px] items-center justify-around rounded-2xl border border-border bg-card/95 px-2 shadow-[0_12px_35px_rgba(14,34,50,.16)] backdrop-blur-xl lg:hidden">
        {navItems.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} data-testid={`link-bottom-${item.label.toLowerCase()}`} className={`flex h-12 min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] ${location === item.href ? 'bg-[#def7ed] font-medium text-[#0b8d73]' : 'text-muted-foreground'}`}><Icon size={17} /><span>{item.label}</span></Link>; })}
      </nav>
    </div>
  );
}

export function PageHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#0c9c7c]"><span className="size-1.5 rounded-full bg-[#b9f25b]" /> {eyebrow}</p><h1 className="text-[clamp(1.75rem,3vw,2.55rem)] font-semibold tracking-[-.055em] text-foreground">{title}</h1>{detail && <p className="mt-1.5 text-sm text-muted-foreground">{detail}</p>}</div>{action}</div>;
}

export function Panel({ children, className = '', testId }: { children: ReactNode; className?: string; testId?: string }) {
  return <section data-testid={testId} className={`rounded-2xl border border-card-border bg-card shadow-[var(--shadow-sm)] ${className}`}>{children}</section>;
}

export function ChainGlyph({ chain }: { chain: string }) {
  const config: Record<string, { bg: string; text: string; mark: ReactNode }> = {
    SOL: { bg: '#e6e2ff', text: '#6645c7', mark: <Sparkles size={15} /> },
    BTC: { bg: '#ffebd5', text: '#d47724', mark: <Bitcoin size={15} /> },
    ETH: { bg: '#dcecff', text: '#4770b6', mark: <span className="text-[13px] font-bold">◆</span> },
  };
  const item = config[chain] ?? config.ETH;
  return <span className="grid size-9 place-items-center rounded-xl" style={{ backgroundColor: item.bg, color: item.text }} data-testid={`glyph-chain-${chain.toLowerCase()}`}>{item.mark}</span>;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

export function LoadingPanel({ rows = 3 }: { rows?: number }) {
  return <div className="space-y-3" data-testid="state-loading">{Array.from({ length: rows }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div>;
}

export function ErrorState({ onRetry, title = 'Could not sync this view' }: { onRetry: () => void; title?: string }) {
  return <div className="rounded-2xl border border-[#f2cbc7] bg-[#fff5f3] p-8 text-center" data-testid="state-error"><p className="font-medium text-[#a33f37]">{title}</p><p className="mt-1 text-sm text-[#a86760]">The latest data is not available right now.</p><button type="button" onClick={onRetry} data-testid="button-retry" className="mt-4 rounded-lg bg-[#a33f37] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#84332c]">Try again</button></div>;
}

export function EmptyState({ label, detail }: { label: string; detail: string }) {
  return <div className="rounded-2xl border border-dashed border-border bg-background/60 p-10 text-center" data-testid="state-empty"><div className="mx-auto mb-3 grid size-10 place-items-center rounded-xl bg-secondary text-primary"><WalletCards size={18} /></div><p className="font-medium">{label}</p><p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{detail}</p></div>;
}

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); } catch { /* clipboard can be unavailable in preview */ } setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <button type="button" onClick={copy} aria-label={label} data-testid={`button-copy-${label.toLowerCase().replace(/\s+/g, '-')}`} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-primary">{copied ? <Check size={14} /> : <Copy size={14} />}</button>;
}

export function Money({ value, digits = 2 }: { value: number; digits?: number }) {
  return <span>${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const tone = status === 'COMPLETED' || status === 'APPROVED' ? 'bg-[#e0f8ed] text-[#087c62]' : status === 'PENDING' ? 'bg-[#fff2d9] text-[#a36a15]' : 'bg-[#ffebe9] text-[#b3443d]';
  return <span data-testid={`status-${status.toLowerCase()}`} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.06em] ${tone}`}><span className="size-1.5 rounded-full bg-current" />{status.toLowerCase()}</span>;
}

export function TypeIcon({ type }: { type: string }) {
  return <span className={`grid size-8 place-items-center rounded-lg ${type === 'DEPOSIT' ? 'bg-[#e0f8ed] text-[#0b9878]' : type === 'WITHDRAWAL' ? 'bg-[#fff0e4] text-[#bd6d2e]' : 'bg-[#e8eff8] text-[#4b709d]'}`}>{type === 'DEPOSIT' ? <ArrowDownToLine size={15} /> : type === 'WITHDRAWAL' ? <ArrowUpRight size={15} /> : <Sparkles size={14} />}</span>;
}