import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils.js'

const variants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-teal-800 text-white hover:bg-teal-900',
        secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200',
        outline: 'border border-stone-300 bg-white text-stone-900 hover:bg-stone-50',
        ghost: 'text-stone-900 hover:bg-stone-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export const Button = forwardRef(function Button(
  { className, variant, size, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'transition-[colors,transform] duration-200 active:scale-[0.98]',
        variants({ variant, size }),
        className,
      )}
      {...props}
    />
  )
})
