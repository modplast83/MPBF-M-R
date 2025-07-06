import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 border border-primary/20",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl hover:shadow-destructive/25 border border-destructive/20",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-md backdrop-blur-sm",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-md hover:shadow-lg border border-secondary/20",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        gradient: "bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20 border border-primary/20",
        success: "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/25 border border-green-500/20",
        warning: "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/25 border border-amber-500/20",
      },
      size: {
        xs: "h-7 rounded-md px-3 text-xs font-medium",
        default: "h-10 px-6 py-2 text-sm",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-12 rounded-lg px-8 text-base font-medium",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };