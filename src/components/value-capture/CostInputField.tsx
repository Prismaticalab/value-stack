
import React from "react";
import { Label } from "@/components/ui/label";
import NumberInput from "./NumberInput";
import ToggleSwitch from "./ToggleSwitch";

interface CostInputFieldProps {
  id: string;
  label: string;
  value: number;
  isPercentage: boolean;
  onValueChange: (value: number) => void;
  onTypeChange: (isPercentage: boolean) => void;
  currencySymbol: string;
  placeholder?: string;
}

const CostInputField = ({
  id,
  label,
  value,
  isPercentage,
  onValueChange,
  onTypeChange,
  currencySymbol,
  placeholder
}: CostInputFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {isPercentage ? "(% of sales)" : `(${currencySymbol})`}
        </Label>
        <ToggleSwitch
          id={`${id}Type`}
          checked={isPercentage}
          onCheckedChange={onTypeChange}
        />
      </div>
      <NumberInput
        id={id}
        label=""
        prefix={isPercentage ? "%" : currencySymbol}
        value={value}
        onChange={onValueChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        min="0"
        step={isPercentage ? "1" : "0.01"}
        max={isPercentage ? "100" : undefined}
      />
    </div>
  );
};

export default CostInputField;
