"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { aiMenu, ctas, mainNav, marketingMenu, webMenu, type NavLink } from "@/content/site";
import { ICON_STROKE } from "./Icon";
import { ButtonLink } from "./ui";

const groups: Record<"marketing" | "web" | "ai", NavLink[]> = {
  marketing: [{ label: "Digital Marketing Overview", href: "/digital-marketing/" }, ...marketingMenu.services],
  web: webMenu,
  ai: aiMenu,
};

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-nav"
      hidden={!open}
      className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto border-t border-line bg-white xl:hidden"
    >
      <nav aria-label="Mobile" className="container-x pt-4 pb-10">
        <ul className="divide-y divide-line">
          {mainNav.map((item) => {
            if (!item.menu) {
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onClose} className="flex min-h-12 items-center text-base font-semibold text-navy-900">
                    {item.label}
                  </Link>
                </li>
              );
            }
            const key = item.menu;
            const isOpen = expanded === key;
            return (
              <li key={item.href}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`m-${key}`}
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="flex min-h-12 w-full items-center justify-between text-left text-base font-semibold text-navy-900"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-5 w-5 text-subtle transition-transform ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={ICON_STROKE}
                    aria-hidden="true"
                  />
                </button>
                <ul id={`m-${key}`} hidden={!isOpen} className="mb-3 space-y-0.5 border-l-2 border-brand-100 pl-3">
                  {groups[key].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={onClose} className="flex min-h-11 items-center text-[0.95rem] text-muted hover:text-brand-700">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  {key === "marketing" && (
                    <li>
                      <Link href="/industries/" onClick={onClose} className="flex min-h-11 items-center text-[0.95rem] text-muted hover:text-brand-700">
                        Industries We Help
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
          <li>
            <Link href="/contact/" onClick={onClose} className="flex min-h-12 items-center text-base font-semibold text-navy-900">
              Contact
            </Link>
          </li>
        </ul>
        <ButtonLink href={ctas.start.href} className="mt-6 w-full">
          {ctas.start.label}
        </ButtonLink>
      </nav>
    </div>
  );
}
