import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "light" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-burgundy)] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-[var(--brand-burgundy)] text-white shadow-lg shadow-[#8A001F]/20 hover:bg-[#700019]",
        variant === "secondary" &&
          "border border-[var(--brand-navy)]/15 bg-white text-[var(--brand-navy)] hover:border-[var(--brand-burgundy)]/35 hover:bg-[var(--brand-burgundy-soft)]",
        variant === "light" &&
          "border border-white/60 bg-white/10 text-white hover:bg-white/20",
        variant === "ghost" && "text-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/8",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className,
      )}
      {...props}
    />
  );
}
