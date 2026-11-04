export default function LoadingState({
  label = "Memuat data",
  lines = 3,
  className = "",
}) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={`space-y-3 ${className}`}
      role="status"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, index) => (
        <div
          className="h-4 animate-pulse rounded-sm bg-[#e1e9e2]"
          key={index}
          style={{ width: `${Math.max(42, 100 - index * 13)}%` }}
        />
      ))}
    </div>
  );
}