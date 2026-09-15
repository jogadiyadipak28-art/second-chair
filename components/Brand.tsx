export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/" className="flex items-center gap-3 min-w-0 group">
      <span className="h-11 w-11 rounded-full overflow-hidden ring-1 ring-ink/10 shadow-sm shrink-0 bg-[#f4eee3]">
        <img
          src="/images/mark-chair.png"
          alt=""
          className="h-full w-full object-cover scale-[1.55] origin-center"
        />
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-[1.35rem] leading-none tracking-tight group-hover:text-moss transition-colors">
          Second Chair
        </span>
        {!compact && (
          <span className="block text-[11px] text-slate mt-1 tracking-wide">
            Briefing desk · not legal advice
          </span>
        )}
      </span>
    </a>
  );
}
