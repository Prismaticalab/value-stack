
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Module } from "@/types/stack";

interface CostInputsProps {
  module: Module;
  onUpdate: (field: keyof Module, value: any) => void;
  isLocked: boolean;
  currencySymbol: string;
}

const CostInputs = ({ module, onUpdate, isLocked, currencySymbol }: CostInputsProps) => {
  const [costInputActive, setCostInputActive] = useState(false);
  const [quantityInputActive, setQuantityInputActive] = useState(false);
  const [costInputError, setCostInputError] = useState<string | null>(null);
  const [quantityInputError, setQuantityInputError] = useState<string | null>(null);

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setCostInputError(null);
      onUpdate("cost", 0);
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
    onUpdate("cost", numValue);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setQuantityInputError(null);
      onUpdate("costQuantity", 1);
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
    onUpdate("costQuantity", numValue);
  };

  return (
    <div className="pt-2">
      <div className="flex items-center">
        <Label className="text-sm font-medium mr-4">Cost</Label>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Fixed</span>
          <Switch
            checked={module.costType === "variable"}
            onCheckedChange={(checked) =>
              onUpdate(
                "costType",
                checked ? "variable" : "fixed"
              )
            }
            disabled={isLocked}
          />
          <span className="text-xs text-gray-500">Variable</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
        {module.costType === "variable" ? (
          <>
            <div>
              <Label htmlFor={`unit-type-${module.id}`} className="text-sm font-medium mb-1 block">Unit Type</Label>
              <Input
                id={`unit-type-${module.id}`}
                className="border-gray-200 focus:border-black focus:ring-black"
                placeholder="Type the nature of unit (e.g., hours, users, 1000 copies, etc)"
                value={module.costUnit || ""}
                onChange={(e) =>
                  onUpdate("costUnit", e.target.value)
                }
                disabled={isLocked}
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={(e) => e.target.placeholder = "Type the nature of unit (e.g., hours, users, 1000 copies, etc)"}
              />
            </div>

            <div className="relative">
              <Label htmlFor={`cost-per-unit-${module.id}`} className="text-sm font-medium mb-1 block">Cost Per Unit</Label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-7">
                <span className="text-gray-500">{currencySymbol}</span>
              </div>
              <Input
                id={`cost-per-unit-${module.id}`}
                className="pl-7 border-gray-200 focus:border-black focus:ring-black"
                type="text"
                inputMode="decimal"
                placeholder={costInputActive ? "" : "0"}
                value={costInputActive ? module.cost || "" : module.cost === 0 ? "" : module.cost}
                onChange={handleCostChange}
                onFocus={() => setCostInputActive(true)}
                onBlur={() => setCostInputActive(false)}
                disabled={isLocked}
              />
              {costInputError && (
                <p className="text-red-500 text-xs mt-1">{costInputError}</p>
              )}
            </div>

            <div>
              <Label htmlFor={`quantity-${module.id}`} className="text-sm font-medium mb-1 block">Number of Units</Label>
              <Input
                id={`quantity-${module.id}`}
                className="border-gray-200 focus:border-black focus:ring-black"
                type="text"
                inputMode="decimal"
                placeholder={quantityInputActive ? "" : "Enter number of units needed"}
                value={quantityInputActive ? module.costQuantity || "" : module.costQuantity || ""}
                onChange={handleQuantityChange}
                disabled={isLocked}
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
            <Label htmlFor={`cost-fixed-${module.id}`} className="text-sm font-medium mb-1 block">Cost</Label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-7">
              <span className="text-gray-500">{currencySymbol}</span>
            </div>
            <Input
              id={`cost-fixed-${module.id}`}
              className="pl-7 border-gray-200 focus:border-black focus:ring-black"
              type="text"
              inputMode="decimal"
              placeholder={costInputActive ? "" : "0"}
              value={costInputActive ? module.cost || "" : module.cost === 0 ? "" : module.cost}
              onChange={handleCostChange}
              onFocus={() => setCostInputActive(true)}
              onBlur={() => setCostInputActive(false)}
              disabled={isLocked}
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

export default CostInputs;
