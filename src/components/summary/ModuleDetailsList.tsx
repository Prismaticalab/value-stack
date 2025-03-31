
import React from "react";
import { Module } from "@/types/stack";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ModuleDetailsListProps {
  modules: Module[];
  currencySymbol: string;
}

const ModuleDetailsList: React.FC<ModuleDetailsListProps> = ({ modules, currencySymbol }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Module Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {index + 1}. {module.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{module.value}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${module.stakeholder === 'internal' ? 'bg-gray-100 text-black' : 'bg-yellow-100 text-yellow-800'}`}>
                      {module.stakeholderName || module.stakeholder}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                      {module.timeImpact} {module.timeUnit}
                    </span>
                    {module.nonNegotiable && (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">
                        Non-negotiable
                      </span>
                    )}
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
  );
};

export default ModuleDetailsList;
