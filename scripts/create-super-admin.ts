/**
 * Creates (or reuses) a Supabase Auth user and makes it the FIRST Super Admin.
 * Runs locally with your service-role key — it is never exposed through the website.
 *
 *   SUPER_ADMIN_EMAIL=you@company.com SUPER_ADMIN_PASSWORD='a-long-password' npm run cms:create-admin
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from the environment
 * (or from .env.local). Refuses to run if a Super Admin already exists.
 */
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = (process.env.SUPER_ADMIN_EMAIL ?? process.argv[2] ?? "").trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "";
  if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local).");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Set SUPER_ADMIN_EMAIL to a valid email address.");

  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  // Find the user, or create it
  let userId: string | null = null;
  for (let page = 1; page <= 20 && !userId; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
    if (data.users.length < 200) break;
  }
  if (!userId) {
    if (password.length < 12) throw new Error("User not found. Set SUPER_ADMIN_PASSWORD (12+ characters) to create it.");
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    userId = data.user.id;
    console.log(`Created auth user ${email}`);
  } else {
    console.log(`Found existing auth user ${email}`);
  }

  const { data, error } = await admin.rpc("bootstrap_super_admin", { p_email: email });
  if (error) throw new Error(error.message);
  console.log(String(data));
  console.log("Sign in at /admin/login/");
}

main().catch((e) => {
  console.error(`\n✖ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
