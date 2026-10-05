import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/ui/Toast";

export const metadata: Metadata = {
  title: { default: "CMS", template: "%s · Pytron Digital CMS" },
  robots: { index: false, follow: false, nocache: true },
};

// Admin pages are always rendered per request for the signed-in user.
export const dynamic = "force-dynamic";

/** Applies the saved light/dark preference before paint (no flash). */
const themeScript = `try{var t=localStorage.getItem('cms-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.getElementById('adm-root');if(r&&d)r.classList.add('dark')}catch(e){}`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="adm-root" className="adm-root" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
