import { LoaderCircle } from "lucide-react";

export default function LoadingState({
  label = "Memuat data",
  lines = 3,
  variant = "skeleton",
  className = "",
}) {
  if (variant === "spinner") {
    return (
      <div
        aria-label={label}
        aria-busy="true"
        className={`flex min-h-24 items-center justify-center gap-3 text-sm text-[#52665a] ${className}`}
        role="status"
      >
        <LoaderCircle
          aria-hidden="true"
          className="size-5 animate-spin text-[#166534] motion-reduce:animate-none"
        />
        <span>{label}</span>
      </div>
    );
  }

  const skeletonLines = Number.isFinite(lines)
    ? Math.min(8, Math.max(1, Math.floor(lines)))
    : 3;

  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={`space-y-3 ${className}`}
      role="status"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: skeletonLines }, (_, index) => (
        <div
          className="h-4 animate-pulse rounded-sm bg-[#e1e9e2] motion-reduce:animate-none"
          key={index}
          style={{ width: `${Math.max(42, 100 - index * 13)}%` }}
        />
      ))}
    </div>
  );
}