export function MirrorXLogo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 ${className}`}
      data-testid="brand-mirrorx"
      aria-label="MirrorX"
    >
      <svg
        aria-hidden="true"
        className="size-8 shrink-0 overflow-visible"
        viewBox="0 0 32 32"
        fill="none"
      >
        <defs>
          <filter id="mirrorx-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="mirrorx-cyan" x1="4" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#67E8F9" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="mirrorx-emerald" x1="28" y1="4" x2="6" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6EE7B7" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="10" fill="#102D3E" />
        <path
          d="M5.5 7.5L26.5 24.5M5.5 24.5L26.5 7.5"
          stroke="url(#mirrorx-cyan)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#mirrorx-glow)"
        />
        <path
          d="M5.5 7.5L11 8.4M5.5 7.5L6.6 13"
          stroke="url(#mirrorx-cyan)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M26.5 24.5L21 23.6M26.5 24.5L25.4 19"
          stroke="url(#mirrorx-emerald)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M5.5 24.5L10.8 23.3M5.5 24.5L6.8 19.2"
          stroke="url(#mirrorx-emerald)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M26.5 7.5L21.2 8.7M26.5 7.5L25.2 12.8"
          stroke="url(#mirrorx-cyan)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#e7f2ee]">
          Mirror<span className="text-[#67e8f9]">X</span>
        </span>
      )}
    </div>
  );
}