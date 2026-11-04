import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Belum ada data",
  description = "Belum ada informasi yang dapat ditampilkan.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
      <Icon aria-hidden="true" className="mb-4 size-8 text-[#75877f]" />
      <h2 className="m-0 text-base font-semibold text-[#18372e]">{title}</h2>
      <p className="mb-0 mt-2 max-w-md text-sm leading-6 text-[#64776f]">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}