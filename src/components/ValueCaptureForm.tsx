
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Stack } from "@/types/stack";

interface ValueCaptureFormProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
}

const ValueCaptureForm = ({ stack, setStack }: ValueCaptureFormProps) => {
  const handleChange = (field: string, value: number) => {
    setStack({
      ...stack,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Value Capture & Pricing</h2>
      <p className="text-sm text-gray-600">
        Set additional costs and your desired profit margin to calculate final pricing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="agencyFees" className="text-sm font-medium">
            Agency Fees ($)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="agencyFees"
              type="number"
              min="0"
              step="0.01"
              value={stack.agencyFees || 0}
              onChange={(e) => handleChange("agencyFees", parseFloat(e.target.value) || 0)}
              className="pl-7 border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralCosts" className="text-sm font-medium">
            Referral Costs ($)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="referralCosts"
              type="number"
              min="0"
              step="0.01"
              value={stack.referralCosts || 0}
              onChange={(e) =>
                handleChange("referralCosts", parseFloat(e.target.value) || 0)
              }
              className="pl-7 border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketingExpenses" className="text-sm font-medium">
            Marketing Expenses ($)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="marketingExpenses"
              type="number"
              min="0"
              step="0.01"
              value={stack.marketingExpenses || 0}
              onChange={(e) =>
                handleChange("marketingExpenses", parseFloat(e.target.value) || 0)
              }
              className="pl-7 border-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex justify-between">
          <Label htmlFor="desiredMargin" className="text-sm font-medium">
            Desired Profit Margin (%)
          </Label>
          <span className="text-sm font-medium">{stack.desiredMargin}%</span>
        </div>
        <Slider
          id="desiredMargin"
          min={10}
          max={300}
          step={1}
          value={[stack.desiredMargin]}
          onValueChange={(val) => handleChange("desiredMargin", val[0])}
          className="my-4"
        />

        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h3 className="font-medium mb-3">Pricing Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Delivery Cost:</span>
              <span>${stack.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Final Price:</span>
              <span>${stack.finalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Net Profit:</span>
              <span>${stack.netProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Actual Margin:</span>
              <span>{stack.marginPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueCaptureForm;
