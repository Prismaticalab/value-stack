
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Create a new inputProps object to avoid mutating props
    const inputProps = {...props};
    
    // Handle decimal input specifically
    if (props.inputMode === 'decimal' || props.inputMode === 'numeric') {
      // Create a new onKeyDown handler that allows both . and , for decimal inputs
      const originalOnKeyDown = props.onKeyDown;
      
      inputProps.onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow comma and period as decimal separators
        if (e.key === ',' || e.key === '.') {
          e.preventDefault();
          
          // Get the current value and cursor position
          const input = e.currentTarget;
          const value = input.value;
          const selectionStart = input.selectionStart || 0;
          const selectionEnd = input.selectionEnd || 0;
          
          // Insert a dot as the decimal separator
          const newValue = value.slice(0, selectionStart) + '.' + value.slice(selectionEnd);
          
          // Set the new value
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, "value"
          )?.set;
          
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, newValue);
            
            // Set cursor position after the inserted dot
            setTimeout(() => {
              input.setSelectionRange(selectionStart + 1, selectionStart + 1);
            }, 0);
            
            // Manually trigger input event to ensure React's onChange is called
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
          }
        }
        
        // Call the original onKeyDown handler if it exists
        if (originalOnKeyDown) {
          originalOnKeyDown(e);
        }
      };
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
