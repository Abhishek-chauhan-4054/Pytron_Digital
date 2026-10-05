"use client";

import { Eye, Save } from "lucide-react";
import type { ContentStatus } from "@/lib/cms/types";
import { formatDateTime } from "@/lib/admin/format";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/Feedback";

/** Right-hand "Publish" card shared by the page, service and blog editors. */
export function PublishPanel({
  status,
  onStatus,
  canPublish,
  date,
  onDate,
  showDate = true,
  saving,
  previewHref,
  updatedAt,
  liveHref,
  dirty,
}: {
  status: ContentStatus;
  onStatus: (s: ContentStatus) => void;
  canPublish: boolean;
  date?: string;
  onDate?: (d: string) => void;
  showDate?: boolean;
  saving: boolean;
  previewHref?: string;
  updatedAt?: string;
  liveHref?: string;
  dirty: boolean;
}) {
  return (
    <section className="adm-card p-5" aria-labelledby="publish-title">
      <div className="flex items-center justify-between">
        <h2 id="publish-title" className="text-sm font-semibold">
          Publish
        </h2>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4 space-y-4">
        {canPublish ? (
          <div>
            <label htmlFor="status" className="adm-label">
              Status
            </label>
            <select id="status" className="adm-input" value={status} onChange={(e) => onStatus(e.target.value as ContentStatus)}>
              <option value="DRAFT">Draft — not visible on the site</option>
              <option value="PUBLISHED">Published — live on the site</option>
              <option value="ARCHIVED">Archived — hidden, kept for reference</option>
            </select>
          </div>
        ) : (
          <p className="adm-muted text-xs leading-relaxed">You can save drafts. An Admin publishes them. Use Preview to check your changes.</p>
        )}
        {showDate && onDate && (
          <div>
            <label htmlFor="published_date" className="adm-label">
              Published date
            </label>
            <input id="published_date" type="date" className="adm-input" value={date ?? ""} onChange={(e) => onDate(e.target.value)} />
            <p className="adm-muted mt-1.5 text-xs">Leave empty to use the moment it&apos;s first published.</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Button type="submit" variant="primary" loading={saving} icon={<Save className="h-4 w-4" aria-hidden="true" />}>
            {saving ? "Saving…" : status === "PUBLISHED" && canPublish ? "Save & publish" : "Save"}
          </Button>
          {previewHref && (
            <a href={previewHref} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary">
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview{dirty ? " (save first)" : ""}
            </a>
          )}
          {liveHref && status === "PUBLISHED" && (
            <a href={liveHref} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
              View live page ↗
            </a>
          )}
        </div>
        {updatedAt && <p className="adm-muted text-xs">Last saved {formatDateTime(updatedAt)}</p>}
      </div>
    </section>
  );
}
