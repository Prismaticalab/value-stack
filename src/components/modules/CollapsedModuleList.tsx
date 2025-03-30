
import { Module } from "@/types/stack";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface CollapsedModuleListProps {
  modules: Module[];
  onEditModule: (moduleId: string) => void;
  currencySymbol: string;
}

const CollapsedModuleList = ({ modules, onEditModule, currencySymbol }: CollapsedModuleListProps) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-3">Modules</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {modules.map((module) => (
          <div key={module.id} className="flex justify-between items-center p-2 bg-white rounded border">
            <div className="flex items-center">
              {module.nonNegotiable && <Star size={14} className="text-yellow-500 mr-2" fill="currentColor" />}
              <div className={`w-2 h-2 rounded-full mr-2 ${module.stakeholder === 'internal' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
              <span className="font-medium">{module.name || "Unnamed Module"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-4">{currencySymbol}{module.costType === 'variable' && module.costQuantity ? (module.cost * module.costQuantity).toFixed(2) : module.cost.toFixed(2)}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditModule(module.id)}
                className="text-xs h-8"
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
