
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberInputProps {
  id: string;
  label: string;
  prefix: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
}

const NumberInput = ({
  id,
  label,
  prefix,
  value,
  onChange,
  placeholder = "Enter value",
  min = "0",
  max,
  step = "0.01"
}: NumberInputProps) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setError(null);
      onChange(0);
      return;
    }
    
    // Check if the value is a valid number
    // Accept both . and , as decimal separators
    const normalizedValue = value.replace(',', '.');
    const numValue = parseFloat(normalizedValue);
    
    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }
    
    setError(null);
    onChange(numValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500">{prefix}</span>
        </div>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          min={min}
          step={step}
          max={max}
          placeholder={placeholder}
          value={isActive ? (value || "") : (value > 0 ? value : "")}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-7 border-gray-200"
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default NumberInput;
