
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Module } from "@/types/stack";

interface CostSectionProps {
  module: Module;
  onChange: (field: keyof Module, value: any) => void;
  currencySymbol: string;
}

const CostSection = ({ module, onChange, currencySymbol }: CostSectionProps) => {
  const [costInputActive, setCostInputActive] = useState(false);
  const [quantityInputActive, setQuantityInputActive] = useState(false);
  const [costInputError, setCostInputError] = useState<string | null>(null);
  const [quantityInputError, setQuantityInputError] = useState<string | null>(null);

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setCostInputError(null);
      onChange("cost", 0);
      return;
    }
    
    // Check if the value is a valid number
    // Accept both . and , as decimal separators
    const normalizedValue = value.replace(',', '.');
    const numValue = parseFloat(normalizedValue);
    
    if (isNaN(numValue)) {
      setCostInputError("Please only use numbers for this field");
      return;
    }
    
    setCostInputError(null);
    onChange("cost", numValue);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setQuantityInputError(null);
      onChange("costQuantity", 1);
      return;
    }
    
    // Check if the value is a valid number
    // Accept both . and , as decimal separators
    const normalizedValue = value.replace(',', '.');
    const numValue = parseFloat(normalizedValue);
    
    if (isNaN(numValue)) {
      setQuantityInputError("Please only use numbers for this field");
      return;
    }
    
    setQuantityInputError(null);
    onChange("costQuantity", numValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label className="text-sm font-medium mr-4">Cost</Label>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Fixed</span>
          <Switch
            checked={module.costType === "variable"}
            onCheckedChange={(checked) => onChange(
              "costType",
              checked ? "variable" : "fixed"
            )}
          />
          <span className="text-xs text-gray-500">Variable</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {module.costType === "variable" ? (
          <>
            <div>
              <Label htmlFor="edit-unit-type" className="text-sm font-medium mb-1 block">Unit Type</Label>
              <Input
                id="edit-unit-type"
                className="border-gray-200 focus:border-black focus:ring-black"
                placeholder="Type the nature of unit (e.g., hours, users, 1000 copies, etc)"
                value={module.costUnit || ""}
                onChange={(e) => onChange("costUnit", e.target.value)}
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={(e) => e.target.placeholder = "Type the nature of unit (e.g., hours, users, 1000 copies, etc)"}
              />
            </div>

            <div className="relative">
              <Label htmlFor="edit-cost-per-unit" className="text-sm font-medium mb-1 block">Cost Per Unit</Label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-7">
                <span className="text-gray-500">{currencySymbol}</span>
              </div>
              <Input
                id="edit-cost-per-unit"
                className="pl-7 border-gray-200 focus:border-black focus:ring-black"
                type="text"
                inputMode="decimal"
                placeholder={costInputActive ? "" : "0"}
                value={costInputActive ? module.cost || "" : module.cost === 0 ? "" : module.cost}
                onChange={handleCostChange}
                onFocus={() => setCostInputActive(true)}
                onBlur={() => setCostInputActive(false)}
              />
              {costInputError && (
                <p className="text-red-500 text-xs mt-1">{costInputError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-quantity" className="text-sm font-medium mb-1 block">Number of Units</Label>
              <Input
                id="edit-quantity"
                className="border-gray-200 focus:border-black focus:ring-black"
                type="text"
                inputMode="decimal"
                placeholder={quantityInputActive ? "" : "Enter number of units needed"}
                value={quantityInputActive ? module.costQuantity || "" : module.costQuantity || ""}
                onChange={handleQuantityChange}
                onFocus={() => {
                  setQuantityInputActive(true);
                }}
                onBlur={() => {
                  setQuantityInputActive(false);
                }}
              />
              {quantityInputError && (
                <p className="text-red-500 text-xs mt-1">{quantityInputError}</p>
              )}
            </div>
          </>
        ) : (
          <div className="relative">
            <Label htmlFor="edit-cost-fixed" className="text-sm font-medium mb-1 block">Cost</Label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-7">
              <span className="text-gray-500">{currencySymbol}</span>
            </div>
            <Input
              id="edit-cost-fixed"
              className="pl-7 border-gray-200 focus:border-black focus:ring-black"
              type="text"
              inputMode="decimal"
              placeholder={costInputActive ? "" : "0"}
              value={costInputActive ? module.cost || "" : module.cost === 0 ? "" : module.cost}
              onChange={handleCostChange}
              onFocus={() => setCostInputActive(true)}
              onBlur={() => setCostInputActive(false)}
            />
            {costInputError && (
              <p className="text-red-500 text-xs mt-1">{costInputError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CostSection;
