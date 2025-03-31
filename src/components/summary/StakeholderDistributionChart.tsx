
import React from "react";
import { Module } from "@/types/stack";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StakeholderDistributionChartProps {
  modules: Module[];
  currencySymbol: string;
}

const StakeholderDistributionChart: React.FC<StakeholderDistributionChartProps> = ({ 
  modules, 
  currencySymbol 
}) => {
  // Calculate stakeholder distribution
  const internalModules = modules.filter(
    (module) => module.stakeholder === "internal"
  );
  const externalModules = modules.filter(
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

  const COLORS = ["#000000", "#F8E16C"];

  return (
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
  );
};

export default StakeholderDistributionChart;
