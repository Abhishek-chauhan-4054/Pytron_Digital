import Link from "next/link";
import { draftMode } from "next/headers";

/**
 * Shown only while an editor is in preview (draft mode). Draft mode is enabled exclusively
 * through /api/preview, which requires a signed-in CMS user.
 */
export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <div role="status" className="sticky top-0 z-[60] bg-amber-400 text-navy-950">
      <div className="container-x flex min-h-10 flex-wrap items-center justify-between gap-2 py-2 text-sm font-semibold">
        <span>Preview mode — you are seeing unpublished changes. Visitors do not see drafts.</span>
        <Link href="/api/preview/exit/" prefetch={false} className="rounded-md bg-navy-950 px-3 py-1 text-white hover:bg-navy-800">
          Exit preview
        </Link>
      </div>
    </div>
  );
}
