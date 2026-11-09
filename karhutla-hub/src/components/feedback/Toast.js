"use client";

import { useCallback, useEffect } from "react";
import { Check, CircleAlert, Info, X } from "lucide-react";

const toastVariants = {
  success: {
    icon: Check,
    styles: "border-[#a9d1af] bg-[#f0f8f0] text-[#27633d]",
    role: "status",
  },
  error: {
    icon: CircleAlert,
    styles: "border-[#e8b8ad] bg-[#fff4f1] text-[#913c2f]",
    role: "alert",
  },
  info: {
    icon: Info,
    styles: "border-[#b8cbd0] bg-[#f1f7f8] text-[#315866]",
    role: "status",
  },
};

export default function Toast({
  title,
  description,
  variant = "info",
  duration = 5000,
  onDismiss,
}) {
  const { icon: Icon, styles, role } = toastVariants[variant] ?? toastVariants.info;
  const dismiss = useCallback(() => onDismiss?.(), [onDismiss]);

  useEffect(() => {
    if (!onDismiss || duration <= 0) return undefined;
    const timerId = window.setTimeout(dismiss, duration);
    return () => window.clearTimeout(timerId);
  }, [dismiss, duration, onDismiss]);

  return (
    <div
      className={`flex w-full max-w-sm items-start gap-3 rounded-sm border p-4 shadow-lg ${styles}`}
      role={role}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title ? <p className="m-0 text-sm font-semibold">{title}</p> : null}
        {description ? (
          <p className="mb-0 mt-1 text-sm leading-5">{description}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          aria-label="Tutup pemberitahuan"
          className="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-1"
          onClick={dismiss}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}