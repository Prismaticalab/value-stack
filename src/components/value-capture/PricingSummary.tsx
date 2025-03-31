
import React from "react";
import { Stack } from "@/types/stack";
import RoundingToggle from "./RoundingToggle";

interface PricingSummaryProps {
  stack: Stack;
  currencySymbol: string;
  title?: string;
  onToggleRounding?: (enabled: boolean) => void;
}

const PricingSummary = ({ stack, currencySymbol, title = "Costing and Pricing Preview", onToggleRounding }: PricingSummaryProps) => {
  // Format currency with 2 decimal places always
  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toFixed(2)}`;
  };
  
  // Format percentage with 2 decimal places if not a whole number
  const formatPercentage = (value: number) => {
    return value % 1 === 0 ? `${value}%` : `${value.toFixed(2)}%`;
  };

  // Calculate segment totals
  const deliveryCost = stack.totalCost || 0;
  const contingencyAmount = (deliveryCost * (stack.contingencyBuffer || 0)) / 100;
  const totalDeliveryCosts = deliveryCost + contingencyAmount;
  
  const effectiveReferralCost = stack.effectiveReferralCost || 0;
  const effectiveAgencyFees = stack.effectiveAgencyFees || 0;
  const effectiveMarketingExpenses = stack.effectiveMarketingExpenses || 0;
  const totalMarketingCosts = effectiveReferralCost + effectiveAgencyFees + effectiveMarketingExpenses;

  return (
    <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <div className="space-y-3">
        {/* Delivery Costs Section with pastel blue background */}
        <div className="p-4 rounded-lg bg-blue-50">
          <div className="flex justify-between text-sm">
            <span>Total Delivery Cost:</span>
            <span className="font-medium">{formatCurrency(stack.totalCost || 0)}</span>
          </div>
          
          <div className="flex justify-between text-sm mt-2">
            <span>Contingency Buffer ({formatPercentage(stack.contingencyBuffer || 0)}):</span>
            <span className="font-medium">
              {formatCurrency((stack.totalCost || 0) * (stack.contingencyBuffer || 0) / 100)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm font-semibold bg-blue-100 p-2 rounded mt-2">
            <span>Total Delivery Costs:</span>
            <span>{formatCurrency(totalDeliveryCosts)}</span>
          </div>
        </div>
        
        {/* Marketing Costs Section with pastel green background */}
        <div className="p-4 rounded-lg bg-green-50">
          {stack.isReferralPercentage ? (
            <div className="flex justify-between text-sm">
              <span>Referral Costs ({formatPercentage(stack.referralCosts || 0)}):</span>
              <span className="font-medium">{formatCurrency(stack.effectiveReferralCost || 0)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm">
              <span>Referral Costs (Fixed):</span>
              <span className="font-medium">{formatCurrency(stack.referralCosts || 0)}</span>
            </div>
          )}
          
          {stack.isAgencyFeesPercentage ? (
            <div className="flex justify-between text-sm mt-2">
              <span>Agency Fees ({formatPercentage(stack.agencyFees || 0)}):</span>
              <span className="font-medium">{formatCurrency(stack.effectiveAgencyFees || 0)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm mt-2">
              <span>Agency Fees (Fixed):</span>
              <span className="font-medium">{formatCurrency(stack.agencyFees || 0)}</span>
            </div>
          )}
          
          {stack.isMarketingPercentage ? (
            <div className="flex justify-between text-sm mt-2">
              <span>Marketing Expenses ({formatPercentage(stack.marketingExpenses || 0)}):</span>
              <span className="font-medium">{formatCurrency(stack.effectiveMarketingExpenses || 0)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm mt-2">
              <span>Marketing Expenses (Fixed):</span>
              <span className="font-medium">{formatCurrency(stack.marketingExpenses || 0)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm font-semibold bg-green-100 p-2 rounded mt-2">
            <span>Total Marketing & Value Capture Costs:</span>
            <span>{formatCurrency(totalMarketingCosts)}</span>
          </div>
        </div>
        
        {/* Profit Section with pastel purple background */}
        <div className="p-4 rounded-lg bg-purple-50">
          <div className="flex justify-between text-sm">
            <span>Target Profit Margin (% of Total Delivery Costs):</span>
            <span className="font-medium">{formatPercentage(stack.desiredMargin || 0)}</span>
          </div>
          
          <div className="flex justify-between text-sm mt-2">
            <span>Net Profit:</span>
            <span className="font-medium">{formatCurrency(stack.netProfit || 0)}</span>
          </div>
          
          <div className="flex justify-between text-sm mt-2">
            <span>Effective Margin:</span>
            <span className="font-medium">{formatPercentage(stack.marginPercent || 0)}</span>
          </div>
        </div>
        
        {/* Final Price Section with highlighted background */}
        <div className="p-4 rounded-lg bg-yellow-50 mt-4">
          <div className="flex justify-between font-medium text-lg">
            <span>Suggested Sale Price:</span>
            <span className="text-blue-600">{formatCurrency(stack.finalPrice || 0)}</span>
          </div>
          
          {/* Add rounding toggle right under the final price */}
          {onToggleRounding && (
            <div className="mt-2">
              <RoundingToggle
                enabled={stack.roundToNearest100 || false}
                onToggle={onToggleRounding}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;
