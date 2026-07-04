import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a3729]/35 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-[#9a3729] bg-[#9a3729] text-[#fff8ee] hover:bg-[#7e2c21]',
        secondary:
          'border border-current bg-transparent text-current hover:bg-black/5 data-[tone=dark]:hover:bg-white/10',
        ghost: 'text-[#4f463e] hover:bg-[#191715] hover:text-[#fff8ee]',
        outline: 'border border-[#d8cfc2] bg-[#fff8ee] text-[#191715] hover:bg-[#efe5d7]',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 px-3',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { buttonVariants }
