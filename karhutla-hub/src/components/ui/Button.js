import { cva } from "class-variance-authority";
import { cn } from "./utils";

export const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174a3a] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#174a3a] text-white hover:bg-[#10392f]",
        secondary:
          "border border-[#bfd1c3] bg-white text-[#174a3a] hover:bg-[#eaf2eb]",
        danger: "bg-[#a83f32] text-white hover:bg-[#8e3026]",
        ghost: "bg-transparent text-[#40574d] hover:bg-[#e8eee8]",
      },
      size: {
        default: "",
        small: "min-h-8 px-3 text-xs",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export default function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}