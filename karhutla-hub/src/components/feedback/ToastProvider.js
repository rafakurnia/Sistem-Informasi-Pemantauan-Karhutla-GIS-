"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import Toast from "./Toast";

const ToastContext = createContext(null);

function toastReducer(toasts, action) {
  if (action.type === "add") return [...toasts, action.toast].slice(-5);
  if (action.type === "dismiss") {
    return toasts.filter((toast) => toast.id !== action.id);
  }
  return toasts;
}

function ToastItem({ toast, onDismiss }) {
  const dismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id]);
  return <Toast {...toast} onDismiss={dismiss} />;
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    dispatch({ type: "dismiss", id });
  }, []);

  const toast = useCallback((options) => {
    const id = `notice-${++nextId.current}`;
    dispatch({
      type: "add",
      toast: {
        id,
        variant: "info",
        duration: 5000,
        ...options,
      },
    });
    return id;
  }, []);

  const contextValue = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        aria-label="Notifikasi"
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
        role="region"
      >
        {toasts.map((item) => (
          <div className="pointer-events-auto" key={item.id}>
            <ToastItem onDismiss={dismiss} toast={item} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider.");
  }
  return context;
}