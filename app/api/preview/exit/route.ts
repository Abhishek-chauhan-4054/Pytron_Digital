import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  (await draftMode()).disable();
  const back = req.headers.get("referer");
  let target = "/";
  try {
    if (back) {
      const u = new URL(back);
      if (u.host === req.nextUrl.host && !u.pathname.startsWith("/api/")) target = u.pathname;
    }
  } catch {
    /* ignore malformed referer */
  }
  return NextResponse.redirect(new URL(target, req.url));
}
