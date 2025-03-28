
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Stack } from "@/types/stack";
import { Switch } from "@/components/ui/switch";

interface ValueCaptureFormProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  currencySymbol: string;
}

const ValueCaptureForm = ({ stack, setStack, currencySymbol }: ValueCaptureFormProps) => {
  const handleChange = (field: string, value: number | boolean) => {
    setStack({
      ...stack,
      [field]: value,
    });
  };

  const calculateFinalPrice = () => {
    // If referral costs are a percentage, we need to adjust the final price calculation
    if (stack.isReferralPercentage) {
      // When referral is a percentage, we need to "gross up" the price
      // so that after deducting the referral %, we still hit our target margin
      const referralMultiplier = 1 - (stack.referralCosts / 100);
      if (referralMultiplier <= 0) return stack.totalCost * (1 + (stack.desiredMargin / 100));
      
      // Calculate price needed to achieve desired margin after referral percentage is deducted
      const basePrice = stack.totalCost * (1 + (stack.desiredMargin / 100));
      return basePrice / referralMultiplier;
    } else {
      // Standard calculation for fixed costs
      const totalCost = stack.totalCost + stack.agencyFees + stack.referralCosts + stack.marketingExpenses;
      return totalCost * (1 + (stack.desiredMargin / 100));
    }
  };

  // Update final price, profit and margin calculations when any values change
  React.useEffect(() => {
    const finalPrice = calculateFinalPrice();
    let totalCostForMargin;
    let referralCostAmount;
    
    if (stack.isReferralPercentage) {
      referralCostAmount = finalPrice * (stack.referralCosts / 100);
      totalCostForMargin = stack.totalCost + stack.agencyFees + referralCostAmount + stack.marketingExpenses;
    } else {
      totalCostForMargin = stack.totalCost + stack.agencyFees + stack.referralCosts + stack.marketingExpenses;
      referralCostAmount = stack.referralCosts;
    }
    
    const netProfit = finalPrice - totalCostForMargin;
    const marginPercent = totalCostForMargin > 0 ? (netProfit / totalCostForMargin) * 100 : 0;
    
    setStack({
      ...stack,
      finalPrice,
      netProfit,
      marginPercent,
      effectiveReferralCost: referralCostAmount
    });
  }, [stack.totalCost, stack.agencyFees, stack.referralCosts, stack.marketingExpenses, 
      stack.desiredMargin, stack.isReferralPercentage]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Value Capture & Pricing</h2>
      <p className="text-sm text-gray-600">
        Set additional costs and your desired profit margin to calculate final pricing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="agencyFees" className="text-sm font-medium">
            Agency Fees ({currencySymbol})
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{currencySymbol}</span>
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
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="referralCosts" className="text-sm font-medium">
              Referral Costs {stack.isReferralPercentage ? "(% of sales)" : `(${currencySymbol})`}
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Fixed</span>
              <Switch 
                id="referralType" 
                checked={stack.isReferralPercentage}
                onCheckedChange={(checked) => handleChange("isReferralPercentage", checked)} 
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{stack.isReferralPercentage ? "%" : currencySymbol}</span>
            </div>
            <Input
              id="referralCosts"
              type="number"
              min="0"
              step={stack.isReferralPercentage ? "1" : "0.01"}
              max={stack.isReferralPercentage ? "100" : undefined}
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
            Marketing Expenses ({currencySymbol})
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{currencySymbol}</span>
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
              <span>{currencySymbol}{stack.totalCost.toFixed(2)}</span>
            </div>
            {stack.isReferralPercentage && stack.effectiveReferralCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>Referral Fee ({stack.referralCosts}% of sales):</span>
                <span>{currencySymbol}{stack.effectiveReferralCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Final Price:</span>
              <span>{currencySymbol}{stack.finalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Net Profit:</span>
              <span>{currencySymbol}{stack.netProfit.toFixed(2)}</span>
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
