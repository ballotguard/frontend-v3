"use client";
import { Button } from "./Button";

export function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="border-b px-4 py-3 font-medium flex items-center justify-between">
          <span>{title}</span>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-black">✕</button>
        </div>
        <div className="p-4">{children}</div>
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          {footer || <Button onClick={onClose} variant="secondary">Close</Button>}
        </div>
      </div>
    </div>
  );
}
