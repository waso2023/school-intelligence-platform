import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-slate-900 text-white",
    secondary: "border-transparent bg-slate-100 text-slate-800",
    destructive: "border-transparent bg-rose-50 text-rose-700 border border-rose-200",
    outline: "text-slate-700 border border-slate-300",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800 border",
    warning: "border-amber-200 bg-amber-50 text-amber-900 border",
    info: "border-blue-200 bg-blue-50 text-blue-800 border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
