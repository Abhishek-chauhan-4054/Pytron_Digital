import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function btnClass(variant: Variant = "secondary", size: "sm" | "md" = "md", extra = "") {
  return `adm-btn adm-btn-${variant} ${size === "sm" ? "adm-btn-sm" : ""} ${extra}`.trim();
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md"; loading?: boolean; icon?: ReactNode }
>(function Button({ variant = "secondary", size = "md", loading = false, icon, className = "", children, disabled, type = "button", ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={btnClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});

export function LinkButton({
  href,
  variant = "secondary",
  size = "md",
  icon,
  children,
  className = "",
  external = false,
}: {
  href: string;
  variant?: Variant;
  size?: "sm" | "md";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass(variant, size, className)}>
        {icon}
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={btnClass(variant, size, className)}>
      {icon}
      {children}
    </Link>
  );
}
