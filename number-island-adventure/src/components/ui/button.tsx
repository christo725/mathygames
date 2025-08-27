import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
        secondary: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
        ghost: "hover:bg-gray-100",
        outline: "border-2 border-gray-300 bg-white hover:bg-gray-50",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }