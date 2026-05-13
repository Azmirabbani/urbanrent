import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils.js'
import { Button } from '@/components/ui/Button.jsx'

/**
 * Modal ringan ala dialog — tanpa Radix (cukup untuk kerangka).
 * @param {{ open: boolean; onOpenChange: (open: boolean) => void; title?: string; children: import('react').ReactNode; className?: string }} props
 */
export function Modal({ open, onOpenChange, title, children, className }) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-lg border border-stone-200 bg-white p-6 shadow-lg',
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? <h2 className="text-lg font-semibold text-stone-900">{title}</h2> : <span />}
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
