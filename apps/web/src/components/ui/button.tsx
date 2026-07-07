import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89116]/45 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-[#0F172A] bg-[#0F172A] text-white hover:bg-[#1f2937] hover:-translate-y-0.5',
        secondary:
          'border border-current bg-transparent text-current hover:bg-black/5 data-[tone=dark]:hover:bg-white/10 hover:-translate-y-0.5',
        ghost: 'text-[#45464d] hover:bg-[#0F172A] hover:text-white',
        outline: 'border border-[#c6c6cd] bg-white/70 text-[#0F172A] hover:bg-[#F8F5F1] hover:-translate-y-0.5',
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
