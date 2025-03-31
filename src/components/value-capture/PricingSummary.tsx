
import React from "react";
import { Stack } from "@/types/stack";

interface PricingSummaryProps {
  stack: Stack;
  currencySymbol: string;
  title?: string;
}

const PricingSummary = ({ stack, currencySymbol, title = "Pricing Summary" }: PricingSummaryProps) => {
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
        <div className="flex justify-between text-sm">
          <span>Total Delivery Cost:</span>
          <span className="font-medium">{formatCurrency(stack.totalCost || 0)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Contingency Buffer ({formatPercentage(stack.contingencyBuffer || 0)}):</span>
          <span className="font-medium">
            {formatCurrency((stack.totalCost || 0) * (stack.contingencyBuffer || 0) / 100)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm font-semibold bg-gray-100 p-2 rounded">
          <span>Total Delivery Costs:</span>
          <span>{formatCurrency(totalDeliveryCosts)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-2 mt-2"></div>
        
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
          <div className="flex justify-between text-sm">
            <span>Agency Fees ({formatPercentage(stack.agencyFees || 0)}):</span>
            <span className="font-medium">{formatCurrency(stack.effectiveAgencyFees || 0)}</span>
          </div>
        ) : (
          <div className="flex justify-between text-sm">
            <span>Agency Fees (Fixed):</span>
            <span className="font-medium">{formatCurrency(stack.agencyFees || 0)}</span>
          </div>
        )}
        
        {stack.isMarketingPercentage ? (
          <div className="flex justify-between text-sm">
            <span>Marketing Expenses ({formatPercentage(stack.marketingExpenses || 0)}):</span>
            <span className="font-medium">{formatCurrency(stack.effectiveMarketingExpenses || 0)}</span>
          </div>
        ) : (
          <div className="flex justify-between text-sm">
            <span>Marketing Expenses (Fixed):</span>
            <span className="font-medium">{formatCurrency(stack.marketingExpenses || 0)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm font-semibold bg-gray-100 p-2 rounded">
          <span>Total Marketing & Value Capture Costs:</span>
          <span>{formatCurrency(totalMarketingCosts)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-2 mt-2"></div>
        
        <div className="flex justify-between text-sm">
          <span>Target Profit Margin:</span>
          <span className="font-medium">{formatPercentage(stack.desiredMargin || 0)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Net Profit:</span>
          <span className="font-medium">{formatCurrency(stack.netProfit || 0)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Effective Margin:</span>
          <span className="font-medium">{formatPercentage(stack.marginPercent || 0)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3"></div>
        
        <div className="flex justify-between font-medium text-lg">
          <span>Final Price:</span>
          <span className="text-blue-600">{formatCurrency(stack.finalPrice || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;
