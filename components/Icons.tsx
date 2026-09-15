export function IconDoc({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 3.5h7.2L18.5 8v12.5H7V3.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 12h5M9.5 15.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconSplit({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="7" height="15" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="13.5" y="4.5" width="7" height="15" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconChat({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 18.5 4 21l3.2-1.1A8.7 8.7 0 0 0 20.5 12 8.5 8.5 0 0 0 5 7.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBrief({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="8" width="17" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8V6.2A2.2 2.2 0 0 1 11.2 4h1.6A2.2 2.2 0 0 1 15 6.2V8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
