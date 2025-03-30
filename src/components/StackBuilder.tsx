
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stack, Module } from "@/types/stack";
import { Save, FileText, ArrowLeft, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ModuleEditDialog from "./module-edit-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ModuleList from "./modules/ModuleList";
import CollapsedModuleList from "./modules/CollapsedModuleList";
import ValueCaptureForm from "./ValueCaptureForm";

interface StackBuilderProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onSave: () => void;
  onViewSummary: () => void;
  currencySymbol: string;
}

const StackBuilder = ({ stack, setStack, onSave, onViewSummary, currencySymbol }: StackBuilderProps) => {
  const [valueCaptureView, setValueCaptureView] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    calculateTotals();
  }, [stack.modules, stack.agencyFees, stack.referralCosts, stack.marketingExpenses, stack.desiredMargin]);

  const calculateTotals = () => {
    const totalDeliveryCost = stack.modules.reduce((sum, module) => {
      if (module.costType === "variable" && module.cost && module.costQuantity) {
        return sum + (module.cost * module.costQuantity);
      }
      return sum + module.cost;
    }, 0);
    
    setStack({
      ...stack,
      totalCost: totalDeliveryCost,
    });
  };

  const addNewModule = () => {
    const newModule: Module = {
      id: crypto.randomUUID(),
      name: "",
      value: "",
      stakeholder: "internal",
      stakeholderName: "",
      costType: "fixed", 
      cost: 0,
      costUnit: "",
      costQuantity: 1,
      timeImpact: 1,
      timeUnit: "days",
      nonNegotiable: false
    };

    setStack({
      ...stack,
      modules: [...stack.modules, newModule]
    });
  };

  const goToPricing = () => {
    setValueCaptureView(true);
    toast({
      title: "Ready to set pricing",
      description: "Now you can set your pricing details."
    });
  };
  
  const openModuleEditor = (moduleId: string) => {
    setEditingModuleId(moduleId);
  };

  const getModuleById = (moduleId: string) => {
    return stack.modules.find(mod => mod.id === moduleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium">Let's build your value delivery stack!</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <HelpCircle size={16} className="text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    This is where you build the modules that make up your value delivery stack.
                    Each module represents a component of your service offering.
                    Add, edit, or arrange modules to create your complete delivery stack.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {stack.description && (
            <p className="text-sm text-gray-500 mt-1">{stack.description}</p>
          )}
        </div>
        <div className="flex gap-2 self-end">
          <Button 
            variant="outline" 
            onClick={onSave}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            Save Progress
          </Button>
          
          {stack.modules.length > 0 && (
            <Button 
              onClick={onViewSummary}
              className="bg-black hover:bg-black/80 flex items-center gap-1"
            >
              <FileText size={16} />
              Summary
            </Button>
          )}
        </div>
      </div>

      {!valueCaptureView ? (
        <ModuleList
          stack={stack}
          setStack={setStack}
          onAddModule={addNewModule}
          onGoToPricing={goToPricing}
          onEditModule={openModuleEditor}
          currencySymbol={currencySymbol}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setValueCaptureView(false)}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to Builder
            </Button>
            <h2 className="text-xl font-medium">Pricing Analysis</h2>
          </div>
          
          <CollapsedModuleList 
            modules={stack.modules} 
            onEditModule={openModuleEditor}
            currencySymbol={currencySymbol} 
          />
          
          <ValueCaptureForm 
            stack={stack} 
            setStack={setStack}
            currencySymbol={currencySymbol}
          />
        </div>
      )}
      
      {/* Module Edit Dialog */}
      {editingModuleId && (
        <ModuleEditDialog
          module={getModuleById(editingModuleId)!}
          onSave={(updatedModule) => {
            setStack({
              ...stack,
              modules: stack.modules.map(mod => 
                mod.id === editingModuleId ? updatedModule : mod
              )
            });
            setEditingModuleId(null);
          }}
          onCancel={() => setEditingModuleId(null)}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};

export default StackBuilder;
