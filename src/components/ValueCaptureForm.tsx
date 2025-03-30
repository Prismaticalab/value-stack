
import React, { useState, useEffect } from "react";
import { Stack } from "@/types/stack";
import { useToast } from "@/hooks/use-toast";
import NumberInput from "./value-capture/NumberInput";
import CostInputField from "./value-capture/CostInputField";
import PricingSummary from "./value-capture/PricingSummary";
import MarginSlider from "./value-capture/MarginSlider";
import { calculateFinalPrice, calculateEffectiveCosts } from "./value-capture/PricingCalculator";

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

    const { finalPrice, costWithContingency, totalRequiredIncome } = calculateFinalPrice(stack);
    
    // Calculate effective costs based on the final price
    const { 
      effectiveReferralCost, 
      effectiveAgencyFees, 
      effectiveMarketingExpenses, 
      valueCaptureTotal 
    } = calculateEffectiveCosts(stack, finalPrice);
    
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
          <NumberInput 
            id="contingencyBuffer"
            label="Contingency Buffer (%)"
            prefix="%"
            value={stack.contingencyBuffer}
            onChange={(value) => handleChange("contingencyBuffer", value)}
            placeholder="Enter contingency buffer"
            min="0"
            step="1"
            max="100"
          />
        </div>

        <CostInputField 
          id="agencyFees"
          label="Agency Fees"
          value={stack.agencyFees}
          isPercentage={stack.isAgencyFeesPercentage}
          onValueChange={(value) => handleChange("agencyFees", value)}
          onTypeChange={(checked) => handleChange("isAgencyFeesPercentage", checked)}
          currencySymbol={currencySymbol}
          placeholder="Enter agency fees"
        />

        <CostInputField 
          id="referralCosts"
          label="Referral Costs"
          value={stack.referralCosts}
          isPercentage={stack.isReferralPercentage}
          onValueChange={(value) => handleChange("referralCosts", value)}
          onTypeChange={(checked) => handleChange("isReferralPercentage", checked)}
          currencySymbol={currencySymbol}
          placeholder="Enter referral costs"
        />

        <CostInputField 
          id="marketingExpenses"
          label="Marketing Expenses"
          value={stack.marketingExpenses}
          isPercentage={stack.isMarketingPercentage}
          onValueChange={(value) => handleChange("marketingExpenses", value)}
          onTypeChange={(checked) => handleChange("isMarketingPercentage", checked)}
          currencySymbol={currencySymbol}
          placeholder="Enter marketing expenses"
        />
      </div>

      <MarginSlider 
        value={stack.desiredMargin}
        onChange={(val) => handleChange("desiredMargin", val)}
      />

      <PricingSummary stack={stack} currencySymbol={currencySymbol} />
    </div>
  );
};

export default ValueCaptureForm;
