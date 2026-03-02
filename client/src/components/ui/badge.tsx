import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// for firearm status badge
const fireArmStatus: Record<FireArmStatus, string> = {
  issued:
    "bg-sky-50 text-sky-700 dark:text-sky-200 border border-sky-100 dark:border-0 dark:bg-zinc-900/80",
  stocked:
    "bg-emerald-50 text-emerald-700 dark:text-emerald-200 border border-emerald-100 dark:border-0 dark:bg-zinc-900/80",
  loss: "bg-amber-50 text-amber-700 dark:text-amber-200 border border-amber-100 dark:border-0 dark:bg-zinc-900/80",
  disposition:
    "bg-rose-50 text-rose-700 dark:text-rose-200 border border-rose-100 dark:border-0 dark:bg-zinc-900/80",
  "turn in":
    "bg-pink-50 text-pink-700 dark:text-pink-200 border border-pink-100 dark:border-0 dark:bg-zinc-900/80",
};

// for audit log status badge
const auditStatusStyles: Record<AuditStatus, string> = {
  register:
    "bg-blue-50 text-blue-700 dark:text-blue-200 border border-blue-100 dark:border-0 dark:bg-zinc-900/80",
  update:
    "bg-yellow-50 text-yellow-700 dark:text-yellow-200 border border-yellow-100 dark:border-0 dark:bg-zinc-900/80",
  delete:
    "bg-red-50 text-red-700 dark:text-red-200 border border-red-100 dark:border-0 dark:bg-zinc-900/80",
  login:
    "bg-emerald-50 text-emerald-700 dark:text-emerald-200 border border-emerald-100 dark:border-0 dark:bg-zinc-900/80",
  logout:
    "bg-gray-50 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-0 dark:bg-zinc-900/80",
};

// for admin account status badge
const adminAccStatusStyles: Record<AdminAccStatus, string> = {
  active:
    "bg-emerald-50 text-emerald-700 dark:text-emerald-200 border border-emerald-100 dark:border-0 dark:bg-zinc-900/80",
  deactivated:
    "bg-rose-50 text-rose-700 dark:text-rose-200 border border-rose-100 dark:border-0 dark:bg-zinc-900/80",
};

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        ...fireArmStatus,
        ...auditStatusStyles,
        ...adminAccStatusStyles,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
