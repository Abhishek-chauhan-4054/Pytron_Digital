"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

/**
 * Accessible modal built on the native <dialog> element (focus trapping, Esc to close
 * and inert background come from the browser).
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const width = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on backdrop
      }}
      className={`adm-dialog m-auto w-[calc(100vw-2rem)] ${width} rounded-2xl border border-slate-200 bg-white p-0 text-slate-800 shadow-2xl dark:border-white/10 dark:bg-[#0d1426] dark:text-slate-200`}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-white/10">
            <div>
              <h2 id={titleId} className="text-base font-semibold">
                {title}
              </h2>
              {description && (
                <p id={descId} className="adm-muted mt-1 text-sm">
                  {description}
                </p>
              )}
            </div>
            <button type="button" onClick={onClose} className="adm-btn adm-btn-ghost adm-btn-sm -mr-2" aria-label="Close dialog">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {children && <div className="overflow-y-auto px-5 py-4">{children}</div>}
          {footer && <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-3 sm:flex-row sm:justify-end dark:border-white/10">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/** Confirmation step for destructive actions. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  tone = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog
      open={open}
      onClose={() => !busy && onCancel()}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button onClick={onCancel} disabled={busy} autoFocus={tone === "danger"}>
            Cancel
          </Button>
          <Button
            variant={tone}
            loading={busy}
            autoFocus={tone !== "danger"}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
              } finally {
                setBusy(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
