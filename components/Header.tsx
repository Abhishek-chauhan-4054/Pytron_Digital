"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { aiMenu, ctas, mainNav, webMenu } from "@/content/site";
import { Logo } from "./Logo";
import { DropdownPanel, MegaMenuPanel } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { ICON_STROKE } from "./Icon";
import { ButtonLink } from "./ui";

type MenuKey = "marketing" | "web" | "ai";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggers = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const panels = useRef<Partial<Record<MenuKey, HTMLDivElement | null>>>({});
  const navRef = useRef<HTMLUListElement>(null);
  const pendingFocus = useRef<{ key: MenuKey; index: "first" | "last" } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close menus after client-side navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const focusItem = useCallback((key: MenuKey, index: number | "first" | "last") => {
    const items = Array.from(panels.current[key]?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? []);
    if (!items.length) return;
    const i = index === "first" ? 0 : index === "last" ? items.length - 1 : index;
    items[(i + items.length) % items.length]?.focus();
  }, []);

  useEffect(() => {
    const req = pendingFocus.current;
    if (!req || open !== req.key) return;
    pendingFocus.current = null;
    const t = setTimeout(() => focusItem(req.key, req.index), 20);
    return () => clearTimeout(t);
  }, [open, focusItem]);

  const openAndFocus = (key: MenuKey, index: "first" | "last") => {
    if (open === key) {
      focusItem(key, index);
      return;
    }
    pendingFocus.current = { key, index };
    setOpen(key);
  };

  const focusTopLevel = (dir: 1 | -1) => {
    const els = Array.from(navRef.current?.querySelectorAll<HTMLElement>("[data-top-item]") ?? []);
    const idx = els.indexOf(document.activeElement as HTMLElement);
    if (idx === -1) return;
    els[(idx + dir + els.length) % els.length]?.focus();
  };

  const onTriggerKey = (key: MenuKey) => (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAndFocus(key, "first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAndFocus(key, "last");
    } else if (e.key === "Escape") {
      setOpen(null);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setOpen(null);
      focusTopLevel(e.key === "ArrowRight" ? 1 : -1);
    }
  };

  const onPanelKey = (key: MenuKey) => (e: React.KeyboardEvent) => {
    const items = Array.from(panels.current[key]?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? []);
    const idx = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(null);
      triggers.current[key]?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      focusItem(key, idx + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      focusItem(key, idx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(key, "first");
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(key, "last");
    }
  };

  const onItemBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 transition-shadow duration-200 ${
        scrolled ? "border-line shadow-[var(--shadow-header)]" : "border-line/70"
      }`}
    >
      <div className="container-x relative flex h-[72px] items-center justify-between gap-3">
        <Logo />

        <nav aria-label="Main" className="hidden xl:block">
          <ul ref={navRef} className="flex items-center">
            {mainNav.map((item) => {
              if (!item.menu) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-top-item
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                          e.preventDefault();
                          focusTopLevel(e.key === "ArrowRight" ? 1 : -1);
                        }
                      }}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="inline-flex min-h-11 items-center rounded-lg px-2 text-[0.875rem] font-medium whitespace-nowrap text-navy-800 transition-colors hover:text-brand-700 aria-[current=page]:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const key = item.menu;
              const isOpen = open === key;
              const isMega = key === "marketing";
              return (
                <li
                  key={item.href}
                  className={isMega ? "" : "relative"}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpen(key);
                  }}
                  onMouseLeave={scheduleClose}
                  onBlur={onItemBlur}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      triggers.current[key] = el;
                    }}
                    data-top-item
                    aria-expanded={isOpen}
                    aria-controls={`menu-${key}`}
                    onClick={() => setOpen(isOpen ? null : key)}
                    onKeyDown={onTriggerKey(key)}
                    className={`inline-flex min-h-11 items-center gap-0.5 rounded-lg px-2 text-[0.875rem] font-medium whitespace-nowrap transition-colors hover:text-brand-700 ${
                      isOpen || isActive(item.href) ? "text-brand-700" : "text-navy-800"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    id={`menu-${key}`}
                    ref={(el) => {
                      panels.current[key] = el;
                    }}
                    data-open={isOpen}
                    onKeyDown={onPanelKey(key)}
                    className={`menu-panel absolute top-full z-50 pt-2 ${
                      isMega ? "inset-x-8" : "left-0 w-[340px]"
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)]">
                      {isMega ? (
                        <MegaMenuPanel onNavigate={() => setOpen(null)} />
                      ) : (
                        <DropdownPanel links={key === "web" ? webMenu : aiMenu} onNavigate={() => setOpen(null)} />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={ctas.start.href} className="hidden sm:inline-flex">
            {ctas.start.label}
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-navy-900 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
    {/* Rendered outside <header>: its backdrop-filter would otherwise trap position:fixed. */}
    <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
