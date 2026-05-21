import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm text-[var(--brand-text)] outline-none placeholder:text-[var(--brand-muted)] focus:border-[var(--brand-burgundy)]",
        className,
      )}
      {...props}
    />
  );
}
