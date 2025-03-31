
import { useState, useEffect } from "react";
import { Stack, Module } from "@/types/stack";
import { useToast } from "@/hooks/use-toast";
import ModuleEditDialog from "./module-edit-dialog";
import ModuleBuilderView from "./builder/ModuleBuilderView";
import PricingView from "./pricing/PricingView";

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

  const handleBackFromPricing = () => {
    if (onBack) {
      onBack();
    } else {
      setValueCaptureView(false);
    }
  };

  return (
    <div className="space-y-6 p-6 w-full">
      {!valueCaptureView ? (
        <ModuleBuilderView 
          stack={stack}
          setStack={setStack}
          onGoToPricing={goToPricing}
          onEditModule={openModuleEditor}
          currencySymbol={currencySymbol}
          onSave={onSave}
        />
      ) : (
        <PricingView 
          stack={stack}
          setStack={setStack}
          onBack={handleBackFromPricing}
          onViewSummary={onViewSummary}
          onEditModule={openModuleEditor}
          currencySymbol={currencySymbol}
        />
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
