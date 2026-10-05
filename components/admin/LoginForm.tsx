"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/admin/actions/auth";
import { Button } from "./ui/Button";
import { describedBy, Field, Input } from "./ui/Field";
import { Alert } from "./ui/Feedback";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={handleSubmit(async (v) => {
        setError("");
        const res = await signIn(v);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        router.replace(next);
        router.refresh();
      })}
    >
      {error && <Alert tone="error">{error}</Alert>}
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="username" autoFocus {...register("email")} {...describedBy("email", errors.email?.message)} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} {...describedBy("password", errors.password?.message)} />
      </Field>
      <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
        Sign in
      </Button>
      <p className="adm-muted text-xs">Forgot your password? Ask a Super Admin to reset it.</p>
    </form>
  );
}
