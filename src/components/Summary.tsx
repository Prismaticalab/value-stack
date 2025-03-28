import React from "react";
import { Stack } from "@/types/stack";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SummaryProps {
  stack: Stack;
  onBack: () => void;
  currencySymbol: string;
}

const Summary = ({ stack, onBack, currencySymbol }: SummaryProps) => {
  // Calculate stakeholder distribution
  const internalModules = stack.modules.filter(
    (module) => module.stakeholder === "internal"
  );
  const externalModules = stack.modules.filter(
    (module) => module.stakeholder === "external"
  );

  const internalCost = internalModules.reduce(
    (sum, module) => sum + module.cost,
    0
  );
  const externalCost = externalModules.reduce(
    (sum, module) => sum + module.cost,
    0
  );

  const stakeholderData = [
    { name: "Internal", value: internalCost },
    { name: "External", value: externalCost },
  ];

  const COLORS = ["#9B87F5", "#F8E16C"];

  // Calculate cost breakdown including value capture elements
  const modulesCost = stack.modules.reduce((sum, module) => sum + module.cost, 0);
  
  // Calculate the effective costs for display
  const agencyFeesValue = stack.isAgencyFeesPercentage ? stack.effectiveAgencyFees : stack.agencyFees;
  const referralCostsValue = stack.isReferralPercentage ? stack.effectiveReferralCost : stack.referralCosts;
  const marketingExpensesValue = stack.isMarketingPercentage ? stack.effectiveMarketingExpenses : stack.marketingExpenses;
  
  const costBreakdown = [
    { name: "Modules", value: modulesCost },
    { name: "Agency Fees", value: agencyFeesValue },
    { name: "Referrals", value: referralCostsValue },
    { name: "Marketing", value: marketingExpensesValue },
  ];

  const downloadPdf = () => {
    // This is a placeholder for PDF generation functionality
    alert("PDF generation would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Builder
        </Button>
        <Button
          variant="outline"
          onClick={downloadPdf}
          className="flex items-center gap-1"
        >
          <Download size={16} />
          Export PDF
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{stack.name}</h1>
        <p className="text-sm text-gray-500">
          {stack.modules.length} modules, {currencySymbol}{stack.finalPrice.toFixed(2)} total price
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stakeholder Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stakeholderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stakeholderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${currencySymbol}${Number(value).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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
                      ''
                    }</span>
                    <span>{currencySymbol}{item.value.toFixed(2)}</span>
                  </div>
                  <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#9B87F5] h-full"
                      style={{
                        width: `${(item.value / (stack.totalCost || 1)) * 100}%`,
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
                <div className="flex justify-between">
                  <span>Desired Margin</span>
                  <span>{stack.desiredMargin}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Net Revenue</span>
                  <span>{currencySymbol}{(stack.totalCost * (1 + stack.desiredMargin / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Value Capture Cost</span>
                  <span>{currencySymbol}{(agencyFeesValue + referralCostsValue + marketingExpensesValue).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actual Margin</span>
                  <span>{stack.marginPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between font-medium text-[#9B87F5]">
                  <span>Suggested Sale Price</span>
                  <span>{currencySymbol}{stack.finalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Profit</span>
                  <span>{currencySymbol}{stack.netProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Module Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stack.modules.map((module, index) => (
              <div key={module.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {index + 1}. {module.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{module.value}</p>
                    <div className="flex gap-2 mt-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${module.stakeholder === 'internal' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {module.stakeholderName || module.stakeholder}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {module.timeImpact} {module.timeUnit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{currencySymbol}{module.cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
