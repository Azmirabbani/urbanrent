import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";

/**
 * Custom confirm dialog — replaces window.confirm
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "default",
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900">
        <div className="p-6">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${variant === "danger" ? "bg-red-50 dark:bg-red-900/30" : "bg-amber-50 dark:bg-amber-900/30"}`}
          >
            {variant === "danger" ? (
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-3 border-t border-stone-100 px-6 py-4 dark:border-stone-800">
          <Button
            ref={cancelRef}
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Batal
          </Button>
          <Button
            type="button"
            className={`flex-1 ${variant === "danger" ? "bg-red-600 hover:bg-red-700" : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage confirm modal state imperatively.
 * Usage:
 *   const { confirm, modal } = useConfirm()
 *   const ok = await confirm({ title: '...', variant: 'danger' })
 *   if (ok) doSomething()
 *   // render {modal} somewhere in JSX
 */
export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    resolve: null,
    title: "",
    description: "",
    confirmLabel: "Confirm",
    variant: "default",
  });

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        setState({
          open: true,
          resolve,
          title: "",
          description: "",
          confirmLabel: "Confirm",
          variant: "default",
          ...opts,
        });
      }),
    [],
  );

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((s) => ({ ...s, open: false }));
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((s) => ({ ...s, open: false }));
  }, [state]);

  const modal = (
    <ConfirmModal
      open={state.open}
      title={state.title}
      description={state.description}
      confirmLabel={state.confirmLabel}
      variant={state.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, modal };
}
