"use client";

import { useEffect, useId, useRef } from "react";
import Button from "../ui/Button";

export default function ConfirmationDialog({
  open,
  title = "Konfirmasi tindakan",
  description,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  destructive = false,
  pending = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="w-[min(100%-32px,440px)] rounded-sm border border-[#dce5dd] bg-white p-0 text-[#18372e] shadow-2xl backdrop:bg-[#10392f]/45"
      onCancel={(event) => {
        event.preventDefault();
        onCancel?.();
      }}
      ref={dialogRef}
    >
      <div className="p-6">
        <h2 className="m-0 text-lg font-semibold" id={titleId}>
          {title}
        </h2>
        {description ? (
          <p
            className="mb-0 mt-2 text-sm leading-6 text-[#64776f]"
            id={descriptionId}
          >
            {description}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <Button disabled={pending} onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button
            disabled={pending}
            onClick={onConfirm}
            type="button"
            variant={destructive ? "danger" : "primary"}
          >
            {pending ? "Memproses..." : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}