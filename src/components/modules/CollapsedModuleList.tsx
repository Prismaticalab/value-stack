
import React from "react";
import { Module } from "@/types/stack";
import { Card, CardContent } from "@/components/ui/card";
import { EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CollapsedModuleListProps {
  modules: Module[];
  onEditModule: (moduleId: string) => void;
  currencySymbol: string;
  hiddenModules?: string[];
  onToggleHiddenModule?: (moduleId: string) => void;
}

const CollapsedModuleList = ({ 
  modules, 
  onEditModule, 
  currencySymbol,
  hiddenModules = [],
  onToggleHiddenModule
}: CollapsedModuleListProps) => {
  const { toast } = useToast();
  
  const handleEditClick = (moduleId: string) => {
    onEditModule(moduleId);
  };

  const handleToggleModuleVisibility = (moduleId: string) => {
    // Check if the module is non-negotiable
    const module = modules.find(mod => mod.id === moduleId);
    
    if (module && module.nonNegotiable && !hiddenModules.includes(moduleId)) {
      toast({
        title: "Cannot Exclude Non-Negotiable Module",
        description: "This module is marked as non-negotiable and cannot be excluded from calculations. Consider editing the module properties if needed.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    if (onToggleHiddenModule) {
      onToggleHiddenModule(moduleId);
    }
  };

  // Calculate total cost of only visible modules
  const visibleTotalCost = modules
    .filter(mod => !hiddenModules.includes(mod.id))
    .reduce((sum, mod) => sum + mod.cost, 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header row with total */}
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="text-lg font-medium">Module List</h3>
            <div className="text-right">
              <div className="text-sm text-gray-500">Visible Total:</div>
              <div className="font-semibold">{currencySymbol}{visibleTotalCost.toFixed(2)}</div>
            </div>
          </div>

          {/* Module list */}
          {modules.map((module, index) => {
            const isHidden = hiddenModules.includes(module.id);
            
            return (
              <div 
                key={module.id} 
                className={`flex items-center justify-between p-3 border rounded-md ${
                  isHidden ? 'bg-gray-100 opacity-60' : ''
                }`}
              >
                <div className="flex-1 mr-2">
                  <div className="flex items-center">
                    <span className="font-medium flex items-center">
                      {index + 1}. {module.name}
                      {module.nonNegotiable && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          Non-negotiable
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      module.stakeholder === 'internal' ? 
                        'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'
                    }`}>
                      {module.stakeholderName || module.stakeholder}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {module.timeImpact} {module.timeUnit}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <div className={`font-medium ${isHidden ? 'line-through text-gray-400' : ''}`}>
                      {currencySymbol}{module.cost.toFixed(2)}
                    </div>
                  </div>
                  
                  {onToggleHiddenModule && (
                    <div className="flex items-center">
                      <Switch
                        id={`toggle-${module.id}`}
                        checked={!isHidden}
                        onCheckedChange={() => handleToggleModuleVisibility(module.id)}
                        className="mr-2"
                      />
                      <Label htmlFor={`toggle-${module.id}`} className="text-xs text-gray-500">
                        {isHidden ? "Excluded from calculations" : "Include in calculations"}
                      </Label>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(module.id)}
                    className="text-xs"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
          
          {modules.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No modules added yet
            </div>
          )}
          
          {hiddenModules && hiddenModules.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> You have {hiddenModules.length} module(s) temporarily excluded from calculations. 
                These modules will need to be included again before proceeding to the Summary page.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollapsedModuleList;
