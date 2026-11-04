import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

export default function Select({ className, children, ...props }) {
  return (
    <span className="relative inline-flex w-full items-center">
      <select
        className={cn(
          "min-h-10 w-full appearance-none rounded-sm border border-[#cbd8ce] bg-white py-2 pl-3 pr-9 text-sm text-[#18372e] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#174a3a] disabled:cursor-not-allowed disabled:bg-[#f3f6f2]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 size-4 text-[#64776f]"
      />
    </span>
  );
}