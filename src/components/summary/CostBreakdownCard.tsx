
import React, { useMemo } from "react";
import { Stack } from "@/types/stack";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CostBreakdownCardProps {
  stack: Stack;
  currencySymbol: string;
}

const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({ stack, currencySymbol }) => {
  // Calculate the effective costs for display
  const modulesCost = useMemo(() => 
    stack.modules.reduce((sum, module) => sum + module.cost, 0),
  [stack.modules]);
  
  const agencyFeesValue = useMemo(() => 
    stack.isAgencyFeesPercentage ? stack.effectiveAgencyFees : stack.agencyFees,
  [stack.effectiveAgencyFees, stack.isAgencyFeesPercentage, stack.agencyFees]);
  
  const referralCostsValue = useMemo(() => 
    stack.isReferralPercentage ? stack.effectiveReferralCost : stack.referralCosts,
  [stack.effectiveReferralCost, stack.isReferralPercentage, stack.referralCosts]);
  
  const marketingExpensesValue = useMemo(() => 
    stack.isMarketingPercentage ? stack.effectiveMarketingExpenses : stack.marketingExpenses,
  [stack.effectiveMarketingExpenses, stack.isMarketingPercentage, stack.marketingExpenses]);
  
  // Add contingency to the cost breakdown
  const contingencyValue = useMemo(() => 
    (stack.totalCost * (stack.contingencyBuffer || 0) / 100), 
  [stack.totalCost, stack.contingencyBuffer]);
  
  // Create cost breakdown items, only including items with values > 0
  const costBreakdown = useMemo(() => [
    { name: "Modules", value: modulesCost },
    ...(contingencyValue > 0 ? [{ name: "Contingency", value: contingencyValue }] : []),
    ...(agencyFeesValue > 0 ? [{ name: "Agency Fees", value: agencyFeesValue }] : []),
    ...(referralCostsValue > 0 ? [{ name: "Referrals", value: referralCostsValue }] : []),
    ...(marketingExpensesValue > 0 ? [{ name: "Marketing", value: marketingExpensesValue }] : []),
  ], [modulesCost, contingencyValue, agencyFeesValue, referralCostsValue, marketingExpensesValue]);

  // Calculate the total value capture costs
  const valueCaptureTotal = useMemo(() => 
    agencyFeesValue + referralCostsValue + marketingExpensesValue,
  [agencyFeesValue, referralCostsValue, marketingExpensesValue]);

  const finalPrice = stack.finalPrice;
  const netProfit = stack.netProfit;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costBreakdown.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}{
                  (item.name === "Agency Fees" && stack.isAgencyFeesPercentage) ? ` (${stack.agencyFees}%)` : 
                  (item.name === "Referrals" && stack.isReferralPercentage) ? ` (${stack.referralCosts}%)` : 
                  (item.name === "Marketing" && stack.isMarketingPercentage) ? ` (${stack.marketingExpenses}%)` : 
                  (item.name === "Contingency") ? ` (${stack.contingencyBuffer}%)` :
                  ''
                }</span>
                <span>{currencySymbol}{item.value.toFixed(2)}</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full"
                  style={{
                    width: `${(item.value / (finalPrice || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>Value Delivery Cost</span>
              <span>{currencySymbol}{stack.totalCost.toFixed(2)}</span>
            </div>
            {stack.contingencyBuffer > 0 && (
              <div className="flex justify-between">
                <span>Contingency Buffer ({stack.contingencyBuffer}%)</span>
                <span>{currencySymbol}{contingencyValue.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Desired Margin</span>
              <span>{stack.desiredMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Net Revenue</span>
              <span>{currencySymbol}{(stack.totalCost * (1 + (stack.contingencyBuffer || 0) / 100) * (1 + stack.desiredMargin / 100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Value Capture Cost</span>
              <span>{currencySymbol}{valueCaptureTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-black">
              <span>Suggested Sale Price</span>
              <span>{currencySymbol}{finalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Net Profit</span>
              <span>{currencySymbol}{netProfit.toFixed(2)}</span>
            </div>
            {/* Removed the Effective Margin line */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
