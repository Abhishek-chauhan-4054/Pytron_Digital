"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { changeMyPassword, updateMyName } from "@/lib/admin/actions/users";
import { Button } from "./ui/Button";
import { describedBy, Field, Input } from "./ui/Field";
import { Card } from "./ui/Layout";
import { useToast } from "./ui/Toast";

export function AccountForms({ name }: { name: string }) {
  const router = useRouter();
  const toast = useToast();
  const [fullName, setFullName] = useState(name);
  const [savingName, setSavingName] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savingPw, setSavingPw] = useState(false);

  return (
    <div className="grid max-w-3xl gap-6">
      <Card title="Profile">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            setSavingName(true);
            const res = await updateMyName(fullName);
            setSavingName(false);
            if (!res.ok) return toast.error(res.error);
            toast.success(res.message ?? "Saved.");
            router.refresh();
          }}
        >
          <Field label="Full name" htmlFor="full_name" className="flex-1">
            <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Button type="submit" variant="primary" loading={savingName}>
            Save
          </Button>
        </form>
      </Card>
      <Card title="Change password" description="At least 12 characters with upper- and lowercase letters and a number.">
        <form
          className="grid gap-4 sm:grid-cols-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (pw.next !== pw.confirm) return setErrors({ confirm: "Passwords don't match" });
            setErrors({});
            setSavingPw(true);
            const res = await changeMyPassword(pw.current, pw.next);
            setSavingPw(false);
            if (!res.ok) {
              setErrors(res.fieldErrors ? { ...res.fieldErrors, next: res.fieldErrors._form ?? res.fieldErrors.next } : { next: res.error });
              return toast.error(res.error);
            }
            setPw({ current: "", next: "", confirm: "" });
            toast.success(res.message ?? "Password changed.");
          }}
        >
          <Field label="Current password" htmlFor="pw-current" error={errors.current}>
            <Input id="pw-current" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} {...describedBy("pw-current", errors.current)} />
          </Field>
          <Field label="New password" htmlFor="pw-next" error={errors.next}>
            <Input id="pw-next" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} {...describedBy("pw-next", errors.next)} />
          </Field>
          <Field label="Confirm new password" htmlFor="pw-confirm" error={errors.confirm}>
            <Input id="pw-confirm" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} {...describedBy("pw-confirm", errors.confirm)} />
          </Field>
          <div className="sm:col-span-3">
            <Button type="submit" variant="primary" loading={savingPw}>
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
