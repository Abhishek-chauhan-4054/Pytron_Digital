"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ExternalLink,
  FileText,
  FolderTree,
  Gauge,
  Images,
  LayoutGrid,
  ListTree,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  ScrollText,
  Search,
  Settings,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { signOut } from "@/lib/admin/actions/auth";
import { ROLE_LABEL, ROLE_RANK, type RoleKey } from "@/lib/cms/types";

type NavItem = { href: string; label: string; icon: ReactNode; min: RoleKey };
const ic = "h-4 w-4 shrink-0";
const NAV: { group: string; items: NavItem[] }[] = [
  { group: "", items: [{ href: "/admin/dashboard/", label: "Dashboard", icon: <Gauge className={ic} aria-hidden="true" />, min: "EDITOR" }] },
  {
    group: "Content",
    items: [
      { href: "/admin/pages/", label: "Pages", icon: <FileText className={ic} aria-hidden="true" />, min: "EDITOR" },
      { href: "/admin/services/", label: "Services", icon: <LayoutGrid className={ic} aria-hidden="true" />, min: "EDITOR" },
      { href: "/admin/blog/", label: "Blog", icon: <Newspaper className={ic} aria-hidden="true" />, min: "EDITOR" },
      { href: "/admin/blog/categories/", label: "Categories", icon: <FolderTree className={ic} aria-hidden="true" />, min: "EDITOR" },
    ],
  },
  { group: "Media", items: [{ href: "/admin/media/", label: "Media Library", icon: <Images className={ic} aria-hidden="true" />, min: "EDITOR" }] },
  {
    group: "Website",
    items: [
      { href: "/admin/navigation/", label: "Navigation", icon: <ListTree className={ic} aria-hidden="true" />, min: "ADMIN" },
      { href: "/admin/seo/", label: "SEO", icon: <Search className={ic} aria-hidden="true" />, min: "ADMIN" },
      { href: "/admin/settings/", label: "Settings", icon: <Settings className={ic} aria-hidden="true" />, min: "ADMIN" },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/admin/users/", label: "Users", icon: <Users className={ic} aria-hidden="true" />, min: "SUPER_ADMIN" },
      { href: "/admin/audit-logs/", label: "Audit Logs", icon: <ScrollText className={ic} aria-hidden="true" />, min: "ADMIN" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/blog/") return pathname.startsWith("/admin/blog") && !pathname.startsWith("/admin/blog/categories");
  return pathname.startsWith(href.replace(/\/$/, ""));
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    // Sync with the class applied by the pre-paint script
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.getElementById("adm-root")?.classList.contains("dark") ?? false);
  }, []);
  return (
    <button
      type="button"
      className="adm-btn adm-btn-ghost adm-btn-sm"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.getElementById("adm-root")?.classList.toggle("dark", next);
        try {
          localStorage.setItem("cms-theme", next ? "dark" : "light");
        } catch {
          /* storage unavailable */
        }
      }}
    >
      {dark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}

export function AdminShell({ user, children }: { user: { email: string; name: string; role: RoleKey }; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Close the mobile drawer after navigating
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const nav = (
    <nav aria-label="CMS" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {NAV.map((g) => {
        const items = g.items.filter((i) => ROLE_RANK[user.role] >= ROLE_RANK[i.min]);
        if (!items.length) return null;
        return (
          <div key={g.group || "main"}>
            {g.group && <p className="px-3 pb-1.5 text-[0.68rem] font-semibold tracking-[0.12em] text-slate-400 uppercase">{g.group}</p>}
            <ul className="space-y-0.5">
              {items.map((i) => {
                const active = isActive(pathname, i.href);
                return (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {i.icon}
                      {i.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  const brand = (
    <Link href="/admin/dashboard/" className="flex items-center gap-2.5 px-5 py-4">
      {/* Gradient via CSS (not an SVG <defs> id) so the mark renders in both the sidebar and the mobile drawer */}
      <span className="bg-gradient-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="h-8 w-8">
          <path d="M22 47V17h12.5c6.6 0 10.5 3.7 10.5 9.4S41.1 36 34.5 36H29v11z M29 30h5c2.8 0 4.5-1.4 4.5-3.6S36.8 22.8 34 22.8h-5z" fill="#fff" fillRule="evenodd" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-white">Pytron Digital</span>
        <span className="block text-[0.7rem] text-slate-400">Content Manager</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <a href="#adm-main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold">
        Skip to content
      </a>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-[#0a1430] lg:flex">
        {brand}
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-slate-950/60" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[#0a1430]">
            <div className="flex items-center justify-between pr-3">
              {brand}
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" aria-label="Close menu">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/85 px-4 backdrop-blur sm:px-6 dark:border-white/10 dark:bg-[#070b17]/85">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-1" />
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost adm-btn-sm hidden sm:inline-flex">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View site
          </a>
          <ThemeToggle />
          <Link href="/admin/account/" className="adm-btn adm-btn-ghost adm-btn-sm max-w-[16rem]" title={user.email}>
            <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden truncate md:inline">{user.name || user.email}</span>
            <span className="hidden rounded bg-slate-100 px-1.5 py-0.5 text-[0.65rem] font-semibold text-slate-600 md:inline dark:bg-white/10 dark:text-slate-300">
              {ROLE_LABEL[user.role]}
            </span>
          </Link>
          <form action={signOut}>
            <button type="submit" className="adm-btn adm-btn-ghost adm-btn-sm" aria-label="Sign out">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </header>
        <main id="adm-main" tabIndex={-1} className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
