
import { Module } from "@/types/stack";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

interface CollapsedModuleListProps {
  modules: Module[];
  onEditModule: (moduleId: string) => void;
  currencySymbol: string;
}

const CollapsedModuleList = ({ modules, onEditModule, currencySymbol }: CollapsedModuleListProps) => {
  const getModuleClasses = (module: Module) => {
    let leftBorder = "";
    
    if (module.stakeholder === 'internal') {
      leftBorder = "border-l-4 border-l-blue-500";
    } else if (module.stakeholder === 'external') {
      leftBorder = "border-l-4 border-l-purple-500";
    }
    
    const rightBorder = module.nonNegotiable 
      ? "border-r-8 border-r-red-500" 
      : "border-r-8 border-r-gray-300";
    
    return `flex justify-between items-center p-2 bg-white rounded border ${leftBorder} ${rightBorder}`;
  };
  
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-3">Modules</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {modules.map((module) => (
          <div key={module.id} className={getModuleClasses(module)}>
            <div className="flex items-center">
              {module.nonNegotiable && (
                <Flag size={14} className="text-red-500 mr-1" />
              )}
              <span className="font-medium">{module.name || "Unnamed Module"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-4">{currencySymbol}{module.costType === 'variable' && module.costQuantity ? (module.cost * module.costQuantity).toFixed(2) : module.cost.toFixed(2)}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditModule(module.id)}
                className="text-xs h-8 hover:bg-black hover:text-white transition-colors"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollapsedModuleList;
