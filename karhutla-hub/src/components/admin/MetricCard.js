import { Card, CardContent } from "../ui/Card";

export default function MetricCard({ label, value, detail, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex min-h-32 items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="m-0 text-sm font-medium text-[#64776f]">{label}</p>
          <p className="mb-0 mt-3 truncate text-3xl font-semibold leading-none text-[#18372e]">
            {value}
          </p>
          {detail ? (
            <p className="mb-0 mt-2 text-xs leading-5 text-[#64776f]">{detail}</p>
          ) : null}
        </div>
        {Icon ? (
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-sm bg-[#e8eee8] text-[#174a3a]">
            <Icon aria-hidden="true" className="size-5" />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}