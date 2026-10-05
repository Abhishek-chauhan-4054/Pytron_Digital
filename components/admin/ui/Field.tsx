import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

export function Field({
  label,
  htmlFor,
  help,
  error,
  children,
  className = "",
  counter,
}: {
  label: ReactNode;
  htmlFor: string;
  help?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  counter?: { value: number; max: number };
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="adm-label">
          {label}
        </label>
        {counter && (
          <span className={`text-xs tabular-nums ${counter.value > counter.max ? "text-red-600" : "adm-muted"}`} aria-hidden="true">
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {help && !error && (
        <p id={`${htmlFor}-help`} className="adm-muted mt-1.5 text-xs leading-relaxed">
          {help}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props linking an input to its help / error text */
export const describedBy = (id: string, error?: string, help?: boolean) => ({
  "aria-invalid": error ? (true as const) : undefined,
  "aria-describedby": error ? `${id}-error` : help ? `${id}-help` : undefined,
});

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className = "", ...rest }, ref) {
  return <input ref={ref} className={`adm-input ${className}`} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className = "", rows = 3, ...rest }, ref) {
  return <textarea ref={ref} rows={rows} className={`adm-input resize-y ${className}`} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className = "", children, ...rest }, ref) {
  return (
    <select ref={ref} className={`adm-input pr-8 ${className}`} {...rest}>
      {children}
    </select>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; description?: ReactNode }>(
  function Checkbox({ label, description, id, className = "", ...rest }, ref) {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <input ref={ref} id={id} type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand-600" {...rest} />
        <label htmlFor={id} className="text-sm">
          <span className="font-medium text-slate-800 dark:text-slate-100">{label}</span>
          {description && <span className="adm-muted mt-0.5 block text-xs">{description}</span>}
        </label>
      </div>
    );
  },
);
