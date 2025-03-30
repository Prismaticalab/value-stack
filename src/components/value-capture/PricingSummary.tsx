
import React from "react";
import { Stack } from "@/types/stack";

interface PricingSummaryProps {
  stack: Stack;
  currencySymbol: string;
}

const PricingSummary = ({ stack, currencySymbol }: PricingSummaryProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-6">
      <h3 className="font-medium mb-3">Pricing Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Current Value Delivery Cost:</span>
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
  );
};

export default PricingSummary;
