import { Link } from 'wouter';
import { ArrowLeft, Compass } from 'lucide-react';
import { Panel, Shell } from '@/components/mirrorx-ui';

export default function NotFound() {
  return <Shell><div className="mx-auto max-w-xl py-12 sm:py-20"><Panel className="surface-grid p-8 text-center sm:p-14" testId="state-not-found"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#dff7ec] text-[#0a9977]"><Compass size={25} /></div><p className="mt-7 text-[10px] font-semibold uppercase tracking-[.22em] text-[#0a9977]">Signal lost</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.07em]">This view is off the map.</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">The route you entered does not belong to your MirrorX command center.</p><Link href="/" data-testid="link-back-overview" className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[#123749] px-5 text-sm font-medium text-[#e9f7f0] transition hover:bg-[#1a4a5c]"><ArrowLeft size={16} /> Back to overview</Link></Panel></div></Shell>;
}
