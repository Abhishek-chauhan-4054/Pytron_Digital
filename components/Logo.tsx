import Link from "next/link";
import { brand } from "@/content/site";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pd-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2457e6" />
          <stop offset="1" stopColor="#6a35e8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#pd-logo-g)" />
      <path
        d="M22 47V17h12.5c6.6 0 10.5 3.7 10.5 9.4S41.1 36 34.5 36H29v11z M29 30h5c2.8 0 4.5-1.4 4.5-3.6S36.8 22.8 34 22.8h-5z"
        fill="#fff"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function Logo({ dark = false, showDescriptor = true }: { dark?: boolean; showDescriptor?: boolean }) {
  return (
    <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label={`${brand.name} — home`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={`text-[1.05rem] font-semibold tracking-[-0.02em] ${dark ? "text-white" : "text-navy-900"}`}>
          {brand.name}
        </span>
        {showDescriptor && (
          <span className={`text-[0.7rem] font-medium whitespace-nowrap max-[359px]:hidden ${dark ? "text-slate-300" : "text-subtle"}`}>
            {brand.descriptor}
          </span>
        )}
      </span>
    </Link>
  );
}
