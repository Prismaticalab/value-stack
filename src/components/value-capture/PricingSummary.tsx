
import { Stack } from "@/types/stack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PricingSummaryProps {
  stack: Stack;
  currencySymbol: string;
  title?: string;
}

const PricingSummary = ({ stack, currencySymbol, title = "Pricing Summary" }: PricingSummaryProps) => {
  const valueCaptureTotal = 
    (stack.isAgencyFeesPercentage ? stack.effectiveAgencyFees : stack.agencyFees) +
    (stack.isReferralPercentage ? stack.effectiveReferralCost : stack.referralCosts) +
    (stack.isMarketingPercentage ? stack.effectiveMarketingExpenses : stack.marketingExpenses);

  const totalCostWithContingency = stack.totalCost * (1 + (stack.contingencyBuffer || 0) / 100);
  const estimatedNetRevenue = totalCostWithContingency * (1 + stack.desiredMargin / 100);
  
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Base Delivery Cost</span>
            <span className="font-medium">{currencySymbol}{stack.totalCost.toFixed(2)}</span>
          </div>
          
          {stack.contingencyBuffer > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Contingency ({stack.contingencyBuffer}%)</span>
              <span className="font-medium">{currencySymbol}{(stack.totalCost * stack.contingencyBuffer / 100).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm">Total Cost with Contingency</span>
            <span className="font-medium">{currencySymbol}{totalCostWithContingency.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Desired Profit ({stack.desiredMargin}%)</span>
            <span className="font-medium">{currencySymbol}{(totalCostWithContingency * stack.desiredMargin / 100).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Net Revenue Required</span>
            <span className="font-medium">{currencySymbol}{estimatedNetRevenue.toFixed(2)}</span>
          </div>

          <Separator />

          {stack.agencyFees > 0 && (
            <div className="flex justify-between items-center text-gray-600">
              <span className="text-sm">Agency Fees {stack.isAgencyFeesPercentage ? `(${stack.agencyFees}%)` : ''}</span>
              <span>{currencySymbol}{(stack.isAgencyFeesPercentage ? stack.effectiveAgencyFees : stack.agencyFees).toFixed(2)}</span>
            </div>
          )}

          {stack.referralCosts > 0 && (
            <div className="flex justify-between items-center text-gray-600">
              <span className="text-sm">Referral Costs {stack.isReferralPercentage ? `(${stack.referralCosts}%)` : ''}</span>
              <span>{currencySymbol}{(stack.isReferralPercentage ? stack.effectiveReferralCost : stack.referralCosts).toFixed(2)}</span>
            </div>
          )}

          {stack.marketingExpenses > 0 && (
            <div className="flex justify-between items-center text-gray-600">
              <span className="text-sm">Marketing Expenses {stack.isMarketingPercentage ? `(${stack.marketingExpenses}%)` : ''}</span>
              <span>{currencySymbol}{(stack.isMarketingPercentage ? stack.effectiveMarketingExpenses : stack.marketingExpenses).toFixed(2)}</span>
            </div>
          )}

          {(stack.agencyFees > 0 || stack.referralCosts > 0 || stack.marketingExpenses > 0) && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Value Capture Costs</span>
              <span className="font-medium">{currencySymbol}{valueCaptureTotal.toFixed(2)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center font-medium text-lg">
            <span>Final Sale Price</span>
            <span className="text-black">{currencySymbol}{stack.roundToNearest100 
              ? Math.ceil(stack.finalPrice / 100) * 100
              : stack.finalPrice.toFixed(2)
            }</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Net Profit</span>
            <span className="font-medium">{currencySymbol}{stack.netProfit.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Profit Margin</span>
            <span className="font-medium">{stack.marginPercent.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSummary;
