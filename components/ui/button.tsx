// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1810] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: 'bg-[#2c1810] text-white hover:bg-[#3d2820] shadow-sm hover:shadow-md',
                outline: 'border border-[#f0ebe6] bg-white text-[#2c1810] hover:bg-[#f8f4f0] hover:border-[#b8a89a]',
                secondary: 'bg-[#f8f4f0] text-[#2c1810] hover:bg-[#f0ebe6]',
                ghost: 'text-[#8a7a6a] hover:bg-[#f8f4f0] hover:text-[#2c1810]',
                destructive: 'bg-[#c0392b] text-white hover:bg-[#e74c3c] shadow-sm hover:shadow-md',
                link: 'text-[#2c1810] underline-offset-4 hover:underline',
                gold: 'bg-[#d4c5b0] text-[#2c1810] hover:bg-[#c9b89a] shadow-sm hover:shadow-md',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-12 px-6 text-base',
                xl: 'h-14 px-8 text-lg',
                icon: 'h-10 w-10',
                'icon-sm': 'h-8 w-8',
                'icon-lg': 'h-12 w-12',
            },
            fullWidth: {
                true: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         className,
         variant,
         size,
         fullWidth,
         asChild,
         loading,
         icon,
         iconPosition = 'left',
         children,
         disabled,
         ...props
     }, ref) => {
        const Comp = asChild ? 'span' : 'button';

        const content = (
            <>
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {!loading && icon && iconPosition === 'left' && (
                    <span className="mr-2">{icon}</span>
                )}
                {children}
                {!loading && icon && iconPosition === 'right' && (
                    <span className="ml-2">{icon}</span>
                )}
            </>
        );

        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, fullWidth, className }),
                    loading && 'cursor-wait'
                )}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {content}
            </Comp>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };