
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stack, Module } from "@/types/stack";
import { ArrowLeft, HelpCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ModuleEditDialog from "./module-edit-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ModuleList from "./modules/ModuleList";
import CollapsedModuleList from "./modules/CollapsedModuleList";
import ValueCaptureForm from "./ValueCaptureForm";
import ModuleListHeader from "./modules/ModuleListHeader";

interface StackBuilderProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onSave: () => void;
  onViewPricing?: () => void;
  onViewSummary?: () => void;
  onBack?: () => void;
  currencySymbol: string;
  pricingView?: boolean;
}

const StackBuilder = ({ 
  stack, 
  setStack, 
  onSave, 
  onViewPricing, 
  onViewSummary,
  onBack,
  currencySymbol,
  pricingView = false
}: StackBuilderProps) => {
  const [valueCaptureView, setValueCaptureView] = useState(pricingView);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setValueCaptureView(pricingView);
  }, [pricingView]);

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
    // This function is now just a placeholder as the actual module creation
    // is handled in the ModuleList component
  };

  const goToPricing = () => {
    setValueCaptureView(true);
    if (onViewPricing) {
      onViewPricing();
    }
    toast({
      title: "Ready to set pricing",
      description: "Now you can set your pricing details.",
      duration: 5000,
    });
  };
  
  const openModuleEditor = (moduleId: string) => {
    setEditingModuleId(moduleId);
  };

  const getModuleById = (moduleId: string) => {
    return stack.modules.find(mod => mod.id === moduleId);
  };

  return (
    <div className="space-y-6 p-6 w-full">
      {!valueCaptureView ? (
        <>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium">Value Delivery Stack</h2>
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

          <ModuleList
            stack={stack}
            setStack={setStack}
            onAddModule={addNewModule}
            onGoToPricing={goToPricing}
            onEditModule={openModuleEditor}
            currencySymbol={currencySymbol}
          />
        </>
      ) : (
        <div className="space-y-6 w-full">
          <div className="flex justify-between items-center">
            <ModuleListHeader 
              title="Costing Review & Pricing" 
              tooltip="Review costs and determine your final pricing strategy. Set additional costs, profit margins, and contingency buffers."
            />
          </div>
          
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  setValueCaptureView(false);
                }
              }}
              className="flex items-center gap-1 border-gray-200 hover:bg-black hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Builder
            </Button>
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

          <div className="flex justify-center mt-4">
            {onViewSummary && (
              <Button
                onClick={onViewSummary}
                className="bg-black hover:bg-black/80 flex items-center gap-1"
              >
                <ArrowRight size={16} />
                View Summary
              </Button>
            )}
          </div>
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
            toast({
              title: "Module Saved",
              description: "Your module has been updated successfully.",
            });
          }}
          onCancel={() => setEditingModuleId(null)}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};

export default StackBuilder;
