// src/components/ui/input.tsx
import { Input as InputPrimitive } from '@base-ui/react/input'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
    "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[error]:border-destructive data-[error]:ring-destructive/20 dark:data-[error]:ring-destructive/40 [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#fff] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1a1a1a]",
    {
        variants: {
            size: {
                default: "h-9 px-3 py-2",
                sm: "h-8 px-2 py-1 text-xs",
                lg: "h-10 px-4 py-3 text-base",
            },
            variant: {
                default: "bg-background",
                ghost: "border-transparent bg-transparent shadow-none focus-visible:ring-0",
                destructive: "border-destructive bg-destructive/10 focus-visible:ring-destructive/20",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
)

interface InputProps
    extends Omit<React.ComponentProps<typeof InputPrimitive>, 'size'>,
        VariantProps<typeof inputVariants> {
    error?: boolean
}

function Input({ className, size, variant, error, ...props }: InputProps) {
    return (
        <InputPrimitive
            data-slot="input"
            data-error={error}
            className={cn(inputVariants({ size, variant, className }))}
            {...props}
        />
    )
}

export { Input, inputVariants }