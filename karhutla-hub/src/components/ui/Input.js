import { cn } from "./utils";

export default function Input({ className, invalid = false, ...props }) {
  return (
    <input
      className={cn(
        "min-h-10 w-full rounded-sm border bg-white px-3 text-sm text-[#18372e] placeholder:text-[#75877f] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#174a3a] disabled:cursor-not-allowed disabled:bg-[#f3f6f2]",
        invalid ? "border-[#a83f32]" : "border-[#cbd8ce]",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}