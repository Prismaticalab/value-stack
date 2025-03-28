
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Stack } from "@/types/stack";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ValueCaptureFormProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  currencySymbol: string;
}

const ValueCaptureForm = ({ stack, setStack, currencySymbol }: ValueCaptureFormProps) => {
  const { toast } = useToast();
  
  const handleChange = (field: string, value: number | boolean) => {
    const updatedStack = {
      ...stack,
      [field]: value,
    };
    setStack(updatedStack);
  };

  const calculateFinalPrice = () => {
    console.log('Starting price calculation with values:', {
      totalCost: stack.totalCost,
      referralCosts: stack.referralCosts,
      isReferralPercentage: stack.isReferralPercentage,
      agencyFees: stack.agencyFees,
      isAgencyFeesPercentage: stack.isAgencyFeesPercentage,
      marketingExpenses: stack.marketingExpenses,
      isMarketingPercentage: stack.isMarketingPercentage,
      desiredMargin: stack.desiredMargin,
      contingencyBuffer: stack.contingencyBuffer
    });
    
    // Calculate base cost with contingency
    const baseModulesCost = stack.totalCost;
    const costWithContingency = baseModulesCost * (1 + (stack.contingencyBuffer || 0) / 100);
    
    // Calculate the total required net revenue (before value capture costs)
    const totalRequiredIncome = costWithContingency * (1 + stack.desiredMargin / 100);
    
    // For percentage-based costs, we need to use the formula:
    // finalPrice = totalRequiredIncome / (1 - sumOfPercentages)
    
    let percentageTotalDeduction = 0;
    let fixedCostsTotal = 0;
    
    if (stack.isReferralPercentage) {
      percentageTotalDeduction += (stack.referralCosts / 100);
    } else {
      fixedCostsTotal += stack.referralCosts;
    }
    
    if (stack.isAgencyFeesPercentage) {
      percentageTotalDeduction += (stack.agencyFees / 100);
    } else {
      fixedCostsTotal += stack.agencyFees;
    }
    
    if (stack.isMarketingPercentage) {
      percentageTotalDeduction += (stack.marketingExpenses / 100);
    } else {
      fixedCostsTotal += stack.marketingExpenses;
    }
    
    // Prevent division by zero or negative numbers
    let denominator = 1 - percentageTotalDeduction;
    
    if (denominator <= 0.01) {
      denominator = 0.01; // Fallback to avoid errors
      
      toast({
        title: "Warning",
        description: "The percentage costs are too high. Adjusting calculations to prevent errors.",
        variant: "destructive"
      });
    }
    
    // Calculate the final price needed to cover all costs
    // If we have percentage costs:
    // finalPrice * (1 - percentages) = totalRequiredIncome + fixedCosts
    let finalPrice;
    
    if (percentageTotalDeduction > 0) {
      finalPrice = (totalRequiredIncome + fixedCostsTotal) / denominator;
    } else {
      finalPrice = totalRequiredIncome + fixedCostsTotal;
    }
    
    // Round up to nearest 50
    finalPrice = Math.ceil(finalPrice / 50) * 50;
    
    console.log('Calculated price before returning:', { 
      finalPrice, 
      costWithContingency, 
      totalRequiredIncome,
      percentageTotalDeduction,
      denominator,
      fixedCostsTotal
    });
    
    return {
      finalPrice,
      costWithContingency,
      totalRequiredIncome
    };
  };

  // Update final price, profit and margin calculations when any values change
  useEffect(() => {
    // Force calculation to run
    console.log('Recalculating pricing with:', {
      totalCost: stack.totalCost,
      referralCosts: stack.referralCosts,
      isReferralPercentage: stack.isReferralPercentage,
      agencyFees: stack.agencyFees,
      isAgencyFeesPercentage: stack.isAgencyFeesPercentage,
      marketingExpenses: stack.marketingExpenses,
      isMarketingPercentage: stack.isMarketingPercentage,
      desiredMargin: stack.desiredMargin,
      contingencyBuffer: stack.contingencyBuffer
    });

    const { finalPrice, costWithContingency, totalRequiredIncome } = calculateFinalPrice();
    
    // Now calculate the effective costs based on the final price
    const effectiveReferralCost = stack.isReferralPercentage 
      ? finalPrice * (stack.referralCosts / 100) 
      : stack.referralCosts;
      
    const effectiveAgencyFees = stack.isAgencyFeesPercentage 
      ? finalPrice * (stack.agencyFees / 100) 
      : stack.agencyFees;
      
    const effectiveMarketingExpenses = stack.isMarketingPercentage 
      ? finalPrice * (stack.marketingExpenses / 100) 
      : stack.marketingExpenses;
    
    // Total value capture costs
    const valueCaptureTotal = effectiveReferralCost + effectiveAgencyFees + effectiveMarketingExpenses;
    
    // Net revenue should exactly equal totalRequiredIncome
    const netRevenue = finalPrice - valueCaptureTotal;
    
    // Net profit = net revenue - cost with contingency
    const netProfit = netRevenue - costWithContingency;
    
    // Margin percent = (net profit / cost with contingency) * 100
    const marginPercent = costWithContingency > 0 ? (netProfit / costWithContingency) * 100 : 0;
    
    console.log('Pricing calculation results:', {
      finalPrice,
      valueCaptureTotal,
      netRevenue,
      totalRequiredIncome, // This should equal netRevenue within rounding errors
      effectiveReferralCost,
      effectiveAgencyFees,
      effectiveMarketingExpenses,
      netProfit,
      marginPercent
    });
    
    // Create a completely new stack object
    const updatedStack: Stack = {
      ...stack,
      finalPrice,
      netProfit,
      marginPercent,
      effectiveReferralCost,
      effectiveAgencyFees,
      effectiveMarketingExpenses,
      totalRequiredIncome // Add this new field to track the required net income
    };
    
    // Set the new stack with all calculated values
    setStack(updatedStack);
  }, [
    stack.totalCost, 
    stack.agencyFees, 
    stack.isAgencyFeesPercentage,
    stack.referralCosts, 
    stack.isReferralPercentage,
    stack.marketingExpenses, 
    stack.isMarketingPercentage,
    stack.desiredMargin,
    stack.contingencyBuffer,
    setStack // Add setStack to dependencies
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
            <Label htmlFor="contingencyBuffer" className="text-sm font-medium">
              Contingency Buffer (%)
            </Label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
            <Input
              id="contingencyBuffer"
              type="number"
              min="0"
              step="1"
              max="100"
              value={stack.contingencyBuffer || 0}
              onChange={(e) => handleChange("contingencyBuffer", parseFloat(e.target.value) || 0)}
              className="pl-7 border-gray-200"
            />
          </div>
        </div>

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
          min={0}
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
            
            {stack.contingencyBuffer > 0 && (
              <div className="flex justify-between text-sm">
                <span>Contingency Buffer ({stack.contingencyBuffer}%):</span>
                <span>{currencySymbol}{(stack.totalCost * (stack.contingencyBuffer / 100)).toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>Cost with Contingency:</span>
              <span>{currencySymbol}{(stack.totalCost * (1 + (stack.contingencyBuffer || 0) / 100)).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Desired Margin:</span>
              <span>{stack.desiredMargin}%</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Total Net Revenue Required:</span>
              <span>{currencySymbol}{(stack.totalRequiredIncome || 0).toFixed(2)}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-200 mt-2">
              <h4 className="font-medium text-sm mb-2">Value Capture Costs:</h4>
              
              {/* Fixed costs section */}
              {!stack.isAgencyFeesPercentage && stack.agencyFees > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Agency Fees (fixed):</span>
                  <span>{currencySymbol}{stack.agencyFees.toFixed(2)}</span>
                </div>
              )}
              
              {!stack.isReferralPercentage && stack.referralCosts > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Referral Fee (fixed):</span>
                  <span>{currencySymbol}{stack.referralCosts.toFixed(2)}</span>
                </div>
              )}
              
              {!stack.isMarketingPercentage && stack.marketingExpenses > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Marketing Expenses (fixed):</span>
                  <span>{currencySymbol}{stack.marketingExpenses.toFixed(2)}</span>
                </div>
              )}
              
              {/* Percentage costs section - show after Total Net Revenue Required */}
              {(stack.isAgencyFeesPercentage || stack.isReferralPercentage || stack.isMarketingPercentage) && (
                <div className="pt-2 mt-1 space-y-2">
                  <h4 className="font-medium text-sm">Percentage of Sales:</h4>
                  
                  {stack.isAgencyFeesPercentage && stack.agencyFees > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Agency Fees ({stack.agencyFees}% of sales):</span>
                      <span>{currencySymbol}{stack.effectiveAgencyFees?.toFixed(2) || "0.00"}</span>
                    </div>
                  )}
                  
                  {stack.isReferralPercentage && stack.referralCosts > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Referral Fee ({stack.referralCosts}% of sales):</span>
                      <span>{currencySymbol}{stack.effectiveReferralCost?.toFixed(2) || "0.00"}</span>
                    </div>
                  )}
                  
                  {stack.isMarketingPercentage && stack.marketingExpenses > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Marketing Expenses ({stack.marketingExpenses}% of sales):</span>
                      <span>{currencySymbol}{stack.effectiveMarketingExpenses?.toFixed(2) || "0.00"}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="flex justify-between font-medium text-black">
                <span>Suggested Sale Price:</span>
                <span>{currencySymbol}{stack.finalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Net Profit:</span>
                <span>{currencySymbol}{stack.netProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueCaptureForm;
