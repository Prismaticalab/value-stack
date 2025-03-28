
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
    // Total cost of modules (X)
    const modulesCost = stack.totalCost;
    
    // Calculate desired profit based on margin percentage (Y)
    const desiredProfit = modulesCost * (stack.desiredMargin / 100);
    
    // Total income required (Z = X + Y)
    const totalRequiredIncome = modulesCost + desiredProfit;
    
    // Additional costs calculations - handle each one based on whether it's percentage or fixed
    let effectiveAgencyFees;
    let effectiveReferralCosts;
    let effectiveMarketingExpenses;
    
    // Calculate agency fees
    if (stack.isAgencyFeesPercentage) {
      // We need to calculate this based on final price, which we don't know yet
      // This will be calculated after we determine the final price
      effectiveAgencyFees = 0; // Placeholder, will be updated
    } else {
      effectiveAgencyFees = stack.agencyFees;
    }
    
    // Calculate marketing expenses
    if (stack.isMarketingPercentage) {
      // We need to calculate this based on final price, which we don't know yet
      // This will be calculated after we determine the final price
      effectiveMarketingExpenses = 0; // Placeholder, will be updated
    } else {
      effectiveMarketingExpenses = stack.marketingExpenses;
    }
    
    // If referral or other costs are percentages, we need to "gross up" the price
    // Sale Price (S) should be such that S - M = Z
    
    // Calculate the denominator for percentage-based costs
    let denominator = 1;
    
    if (stack.isReferralPercentage) {
      denominator -= (stack.referralCosts / 100);
    }
    
    if (stack.isAgencyFeesPercentage) {
      denominator -= (stack.agencyFees / 100);
    }
    
    if (stack.isMarketingPercentage) {
      denominator -= (stack.marketingExpenses / 100);
    }
    
    // Prevent division by zero or negative numbers
    if (denominator <= 0) {
      denominator = 0.01; // Fallback to avoid errors
    }
    
    // Calculate final price with all fixed costs and percentage-based adjustments
    let finalPrice = totalRequiredIncome / denominator;
    
    // Add any fixed costs
    if (!stack.isReferralPercentage) {
      finalPrice += stack.referralCosts;
    }
    
    if (!stack.isAgencyFeesPercentage) {
      finalPrice += stack.agencyFees;
    }
    
    if (!stack.isMarketingPercentage) {
      finalPrice += stack.marketingExpenses;
    }
    
    return finalPrice;
  };

  // Update final price, profit and margin calculations when any values change
  React.useEffect(() => {
    const modulesCost = stack.totalCost;
    const finalPrice = calculateFinalPrice();
    
    // Now calculate the effective costs based on the final price
    let effectiveReferralCost = stack.isReferralPercentage 
      ? finalPrice * (stack.referralCosts / 100) 
      : stack.referralCosts;
      
    let effectiveAgencyFees = stack.isAgencyFeesPercentage 
      ? finalPrice * (stack.agencyFees / 100) 
      : stack.agencyFees;
      
    let effectiveMarketingExpenses = stack.isMarketingPercentage 
      ? finalPrice * (stack.marketingExpenses / 100) 
      : stack.marketingExpenses;
    
    // Total cost including all expenses
    const totalExpenses = modulesCost + effectiveAgencyFees + effectiveReferralCost + effectiveMarketingExpenses;
    
    // Net profit = final price - total expenses
    const netProfit = finalPrice - totalExpenses;
    
    // Margin percent = (net profit / cost) * 100
    const marginPercent = modulesCost > 0 ? (netProfit / modulesCost) * 100 : 0;
    
    // Update the stack with all calculated values
    setStack({
      ...stack,
      finalPrice,
      netProfit,
      marginPercent,
      effectiveReferralCost,
      effectiveAgencyFees,
      effectiveMarketingExpenses
    });
  }, [
    stack.totalCost, 
    stack.agencyFees, stack.isAgencyFeesPercentage,
    stack.referralCosts, stack.isReferralPercentage,
    stack.marketingExpenses, stack.isMarketingPercentage,
    stack.desiredMargin
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Value Capture & Pricing</h2>
      <p className="text-sm text-gray-600">
        Set additional costs and your desired profit margin to calculate final pricing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="agencyFees" className="text-sm font-medium">
              Agency Fees {stack.isAgencyFeesPercentage ? "(% of sales)" : `(${currencySymbol})`}
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Fixed</span>
              <Switch 
                id="agencyFeesType" 
                checked={stack.isAgencyFeesPercentage}
                onCheckedChange={(checked) => handleChange("isAgencyFeesPercentage", checked)} 
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{stack.isAgencyFeesPercentage ? "%" : currencySymbol}</span>
            </div>
            <Input
              id="agencyFees"
              type="number"
              min="0"
              step={stack.isAgencyFeesPercentage ? "1" : "0.01"}
              max={stack.isAgencyFeesPercentage ? "100" : undefined}
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
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="marketingExpenses" className="text-sm font-medium">
              Marketing Expenses {stack.isMarketingPercentage ? "(% of sales)" : `(${currencySymbol})`}
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Fixed</span>
              <Switch 
                id="marketingType" 
                checked={stack.isMarketingPercentage}
                onCheckedChange={(checked) => handleChange("isMarketingPercentage", checked)} 
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{stack.isMarketingPercentage ? "%" : currencySymbol}</span>
            </div>
            <Input
              id="marketingExpenses"
              type="number"
              min="0"
              step={stack.isMarketingPercentage ? "1" : "0.01"}
              max={stack.isMarketingPercentage ? "100" : undefined}
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
              <span>Value Delivery Cost:</span>
              <span>{currencySymbol}{stack.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Desired Margin:</span>
              <span>{stack.desiredMargin}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Net Revenue Required:</span>
              <span>{currencySymbol}{(stack.totalCost * (1 + stack.desiredMargin / 100)).toFixed(2)}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-200 mt-2">
              <h4 className="font-medium text-sm mb-2">Value Capture Costs:</h4>
              
              {stack.isAgencyFeesPercentage ? (
                <div className="flex justify-between text-sm">
                  <span>Agency Fees ({stack.agencyFees}% of sales):</span>
                  <span>{currencySymbol}{stack.effectiveAgencyFees?.toFixed(2) || "0.00"}</span>
                </div>
              ) : stack.agencyFees > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Agency Fees (fixed):</span>
                  <span>{currencySymbol}{stack.agencyFees.toFixed(2)}</span>
                </div>
              )}
              
              {stack.isReferralPercentage ? (
                <div className="flex justify-between text-sm">
                  <span>Referral Fee ({stack.referralCosts}% of sales):</span>
                  <span>{currencySymbol}{stack.effectiveReferralCost.toFixed(2)}</span>
                </div>
              ) : stack.referralCosts > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Referral Fee (fixed):</span>
                  <span>{currencySymbol}{stack.referralCosts.toFixed(2)}</span>
                </div>
              )}
              
              {stack.isMarketingPercentage ? (
                <div className="flex justify-between text-sm">
                  <span>Marketing Expenses ({stack.marketingExpenses}% of sales):</span>
                  <span>{currencySymbol}{stack.effectiveMarketingExpenses?.toFixed(2) || "0.00"}</span>
                </div>
              ) : stack.marketingExpenses > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Marketing Expenses (fixed):</span>
                  <span>{currencySymbol}{stack.marketingExpenses.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="flex justify-between font-medium text-[#9B87F5]">
                <span>Suggested Sale Price:</span>
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
    </div>
  );
};

export default ValueCaptureForm;
