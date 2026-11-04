import { cn } from "./utils";

export function Card({ className, ...props }) {
  return (
    <section
      className={cn("rounded-sm border border-[#dce5dd] bg-white", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("border-b border-[#e7ece8] px-5 py-4", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h2 className={cn("m-0 text-base font-semibold text-[#18372e]", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("mt-1 text-sm leading-5 text-[#64776f]", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}