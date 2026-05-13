import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const ToastContext = createContext(null)

/**
 * @typedef {{ id: string; title?: string; description?: string; variant?: 'default' | 'success' | 'destructive' }} ToastItem
 */

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState(
    /** @type {ToastItem[]} */ ([]),
  )

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (opts) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now())
      const item = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? 'default',
      }
      setToasts((list) => [...list, item])
      const ms = opts.duration ?? 4200
      window.setTimeout(() => dismiss(id), ms)
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className="pointer-events-none fixed bottom-0 right-0 z-100 flex max-h-[min(40vh,320px)] w-full flex-col-reverse gap-2 overflow-y-auto p-4 sm:bottom-4 sm:right-4 sm:max-w-sm sm:flex-col"
            aria-live="polite"
          >
            {toasts.map((t) => (
              <ToastBanner key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

/**
 * @param {{ item: ToastItem; onDismiss: () => void }} props
 */
function ToastBanner({ item, onDismiss }) {
  const variantStyles =
    item.variant === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
      : item.variant === 'destructive'
        ? 'border-red-200 bg-red-50 text-red-950'
        : 'border-stone-200 bg-white text-stone-900'

  return (
    <div
      className={`toast-enter pointer-events-auto flex gap-3 rounded-xl border px-4 py-3 shadow-lg ${variantStyles}`}
      role="status"
    >
      <div className="min-w-0 flex-1">
        {item.title ? (
          <p className="text-sm font-semibold leading-snug">{item.title}</p>
        ) : null}
        {item.description ? (
          <p className="mt-0.5 text-sm leading-snug opacity-90">{item.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        aria-label="Tutup"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast harus dipakai dalam ToastProvider')
  }
  return ctx
}
