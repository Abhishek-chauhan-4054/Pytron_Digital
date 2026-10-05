"use client";

import { Alert } from "@/components/admin/ui/Feedback";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-10">
      <Alert tone="error" title="This screen couldn't load">
        Something went wrong on our side. Your content is safe.
      </Alert>
      <button type="button" onClick={reset} className="adm-btn adm-btn-secondary mt-4">
        Try again
      </button>
    </div>
  );
}
