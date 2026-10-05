"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { KeyRound, Plus, Trash2, UserCheck, UserX } from "lucide-react";
import { createUser, deleteUser, resetUserPassword, setUserActive, setUserRole } from "@/lib/admin/actions/users";
import { createUserSchema } from "@/lib/schemas/site";
import { ROLE_LABEL, type RoleKey } from "@/lib/cms/types";
import { formatDateTime } from "@/lib/admin/format";
import { Button } from "./ui/Button";
import { ConfirmDialog, Dialog } from "./ui/Dialog";
import { Badge } from "./ui/Feedback";
import { describedBy, Field, Input, Select } from "./ui/Field";
import { useToast } from "./ui/Toast";

type U = { id: string; email: string; full_name: string; is_active: boolean; last_sign_in_at: string | null; role: RoleKey | null };

const ROLE_HELP: Record<RoleKey, string> = {
  SUPER_ADMIN: "Everything, including users and site settings.",
  ADMIN: "Publish, unpublish and delete content; media; navigation; SEO.",
  EDITOR: "Create and edit drafts. Cannot publish, delete or manage users.",
};

function suggestPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const arr = new Uint32Array(16);
  crypto.getRandomValues(arr);
  const base = Array.from(arr, (n) => chars[n % chars.length]).join("");
  return `${base.slice(0, 5)}-${base.slice(5, 10)}-${base.slice(10, 15)}A7`;
}

export function UsersManager({ users, me, canCreate }: { users: U[]; me: string; canCreate: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();
  const [create, setCreate] = useState<null | { email: string; full_name: string; role: RoleKey; password: string }>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [reset, setReset] = useState<null | { user: U; password: string }>(null);
  const [confirm, setConfirm] = useState<null | { kind: "deactivate" | "delete"; user: U }>(null);

  const done = (res: { ok: boolean; error?: string; message?: string }) => {
    if (!res.ok) toast.error(res.error ?? "Failed.");
    else {
      toast.success(res.message ?? "Done.");
      router.refresh();
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          variant="primary"
          disabled={!canCreate}
          icon={<Plus className="h-4 w-4" aria-hidden="true" />}
          onClick={() => {
            setErrors({});
            setCreate({ email: "", full_name: "", role: "EDITOR", password: suggestPassword() });
          }}
        >
          Add user
        </Button>
      </div>
      <div className="adm-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.02]">
            <tr>
              <th scope="col" className="adm-th">User</th>
              <th scope="col" className="adm-th">Role</th>
              <th scope="col" className="adm-th hidden md:table-cell">Last sign-in</th>
              <th scope="col" className="adm-th"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className={u.is_active ? "" : "opacity-60"}>
                <td className="adm-td">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {u.full_name || "—"} {u.id === me && <Badge tone="brand">You</Badge>} {!u.is_active && <Badge tone="red">Deactivated</Badge>}
                  </p>
                  <p className="adm-muted text-xs">{u.email}</p>
                </td>
                <td className="adm-td">
                  <label htmlFor={`role-${u.id}`} className="sr-only">
                    Role for {u.email}
                  </label>
                  <select
                    id={`role-${u.id}`}
                    className="adm-input min-h-8 w-40 py-1"
                    value={u.role ?? "NONE"}
                    disabled={pending || u.id === me}
                    onChange={(e) => start(async () => done(await setUserRole(u.id, e.target.value as RoleKey | "NONE")))}
                  >
                    <option value="NONE">No access</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td className="adm-td adm-muted hidden text-xs md:table-cell">{formatDateTime(u.last_sign_in_at)}</td>
                <td className="adm-td">
                  {u.id !== me && (
                    <div className="flex justify-end gap-0.5">
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5" disabled={!canCreate} onClick={() => setReset({ user: u, password: suggestPassword() })} aria-label={`Reset password for ${u.email}`} title="Reset password">
                        <KeyRound className="h-4 w-4" aria-hidden="true" />
                      </button>
                      {u.is_active ? (
                        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5" onClick={() => setConfirm({ kind: "deactivate", user: u })} aria-label={`Deactivate ${u.email}`} title="Deactivate">
                          <UserX className="h-4 w-4" aria-hidden="true" />
                        </button>
                      ) : (
                        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5" disabled={pending} onClick={() => start(async () => done(await setUserActive(u.id, true)))} aria-label={`Reactivate ${u.email}`} title="Reactivate">
                          <UserCheck className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5 text-red-600" disabled={!canCreate} onClick={() => setConfirm({ kind: "delete", user: u })} aria-label={`Delete ${u.email}`} title="Delete">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
        {(Object.keys(ROLE_HELP) as RoleKey[]).map((r) => (
          <div key={r} className="adm-card p-4">
            <dt className="font-semibold">{ROLE_LABEL[r]}</dt>
            <dd className="adm-muted mt-1 text-xs">{ROLE_HELP[r]}</dd>
          </div>
        ))}
      </dl>

      <Dialog
        open={create !== null}
        onClose={() => setCreate(null)}
        title="Add user"
        description="Creates a confirmed account with a temporary password. Share it securely — they can change it under My account."
        footer={
          <>
            <Button onClick={() => setCreate(null)}>Cancel</Button>
            <Button
              variant="primary"
              loading={saving}
              onClick={async () => {
                if (!create) return;
                const parsed = createUserSchema.safeParse(create);
                if (!parsed.success) {
                  const errs: Record<string, string> = {};
                  for (const i of parsed.error.issues) errs[i.path.join(".")] ??= i.message;
                  return setErrors(errs);
                }
                setSaving(true);
                const res = await createUser(create);
                setSaving(false);
                if (!res.ok) return setErrors(res.fieldErrors ?? { email: res.error });
                done(res);
                setCreate(null);
              }}
            >
              Create user
            </Button>
          </>
        }
      >
        {create && (
          <div className="space-y-4">
            <Field label="Email" htmlFor="u-email" error={errors.email}>
              <Input id="u-email" type="email" autoFocus value={create.email} onChange={(e) => setCreate({ ...create, email: e.target.value })} {...describedBy("u-email", errors.email)} />
            </Field>
            <Field label="Full name" htmlFor="u-name" error={errors.full_name}>
              <Input id="u-name" value={create.full_name} onChange={(e) => setCreate({ ...create, full_name: e.target.value })} {...describedBy("u-name", errors.full_name)} />
            </Field>
            <Field label="Role" htmlFor="u-role" help={ROLE_HELP[create.role]}>
              <Select id="u-role" value={create.role} onChange={(e) => setCreate({ ...create, role: e.target.value as RoleKey })}>
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </Select>
            </Field>
            <Field label="Temporary password" htmlFor="u-pass" error={errors.password} help="At least 12 characters with upper- and lowercase letters and a number.">
              <Input id="u-pass" className="font-mono" value={create.password} onChange={(e) => setCreate({ ...create, password: e.target.value })} {...describedBy("u-pass", errors.password, true)} />
            </Field>
          </div>
        )}
      </Dialog>

      <Dialog
        open={reset !== null}
        onClose={() => setReset(null)}
        title={`Reset password — ${reset?.user.email ?? ""}`}
        description="Set a new temporary password and share it with the user securely."
        size="sm"
        footer={
          <>
            <Button onClick={() => setReset(null)}>Cancel</Button>
            <Button
              variant="primary"
              loading={saving}
              onClick={async () => {
                if (!reset) return;
                setSaving(true);
                const res = await resetUserPassword(reset.user.id, reset.password);
                setSaving(false);
                done(res);
                if (res.ok) setReset(null);
              }}
            >
              Reset password
            </Button>
          </>
        }
      >
        {reset && (
          <Field label="New password" htmlFor="r-pass">
            <Input id="r-pass" className="font-mono" value={reset.password} onChange={(e) => setReset({ ...reset, password: e.target.value })} />
          </Field>
        )}
      </Dialog>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.kind === "delete" ? "Delete this user?" : "Deactivate this user?"}
        description={
          confirm?.kind === "delete"
            ? `${confirm.user.email} will be removed permanently. Their past audit-log entries are kept.`
            : `${confirm?.user.email ?? ""} will lose CMS access immediately. You can reactivate them later.`
        }
        confirmLabel={confirm?.kind === "delete" ? "Delete" : "Deactivate"}
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          if (!confirm) return;
          const res = confirm.kind === "delete" ? await deleteUser(confirm.user.id) : await setUserActive(confirm.user.id, false);
          setConfirm(null);
          done(res);
        }}
      />
    </>
  );
}
