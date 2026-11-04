import { cva } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center rounded-sm px-2 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-[#e8eee8] text-[#40574d]",
        success: "bg-[#e3f2e4] text-[#27633d]",
        warning: "bg-[#fff1d6] text-[#79500b]",
        danger: "bg-[#fbe6e1] text-[#913c2f]",
        info: "bg-[#e2eef2] text-[#315866]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export default function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}