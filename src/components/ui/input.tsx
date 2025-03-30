
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Special handling for decimal inputs
    const inputProps = {...props};
    
    // If the input is for numbers (decimal, numeric), allow commas and dots
    if (props.inputMode === 'decimal' || props.inputMode === 'numeric') {
      const originalOnChange = props.onChange;
      
      if (originalOnChange) {
        inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          // Let the parent component handle the actual value conversion
          originalOnChange(e);
        };
      }
    }
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        ref={ref}
        {...inputProps}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
