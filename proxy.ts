import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session cookie for the admin area (and for preview
 * requests), and sends signed-out visitors to /admin/login/.
 * Real authorization happens again on the server (layout + every server action) and in RLS.
 */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  const isAdmin = pathname.startsWith("/admin");

  if (!url || !key) {
    // CMS not configured: the admin area shows a setup notice (handled by the pages).
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, ...cookieOptions }));
      },
    },
  });

  // Validates the JWT with Supabase Auth (not just decoding the cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdmin && !isLogin && !user) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login/";
    login.search = pathname === "/admin/" || pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(login);
  }
  if (isLogin && user) {
    const dash = request.nextUrl.clone();
    dash.pathname = "/admin/dashboard/";
    dash.search = "";
    return NextResponse.redirect(dash);
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/preview/:path*",
    // Public pages only run this when a preview (draft mode) cookie is present
    {
      source: "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml)$).*)",
      has: [{ type: "cookie", key: "__prerender_bypass" }],
    },
  ],
};
