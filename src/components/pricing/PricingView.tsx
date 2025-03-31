
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/types/stack";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ModuleListHeader from "../modules/ModuleListHeader";
import CollapsedModuleList from "../modules/CollapsedModuleList";
import ValueCaptureForm from "../ValueCaptureForm";
import PricingSummary from "../value-capture/PricingSummary";

interface PricingViewProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onBack: () => void;
  onViewSummary?: () => void;
  onEditModule: (moduleId: string) => void;
  currencySymbol: string;
}

const PricingView = ({
  stack,
  setStack,
  onBack,
  onViewSummary,
  onEditModule,
  currencySymbol
}: PricingViewProps) => {
  const { toast } = useToast();
  const [hiddenModules, setHiddenModules] = useState<string[]>([]);
  const [simulatedStack, setSimulatedStack] = useState<Stack>(stack);

  useEffect(() => {
    if (hiddenModules.length === 0) {
      // If no hidden modules, use the original stack
      setSimulatedStack(stack);
    } else {
      // Create a simulated stack with hidden modules excluded from calculations
      const filteredModules = stack.modules.filter(
        mod => !hiddenModules.includes(mod.id)
      );
      
      const simulatedStackCopy = {
        ...stack,
        modules: filteredModules,
        // Recalculate total cost based on visible modules only
        totalCost: filteredModules.reduce((sum, mod) => {
          if (mod.costType === "variable" && mod.cost && mod.costQuantity) {
            return sum + (mod.cost * mod.costQuantity);
          }
          return sum + mod.cost;
        }, 0)
      };
      
      setSimulatedStack(simulatedStackCopy);
    }
  }, [stack, hiddenModules]);

  const handleToggleHiddenModule = (moduleId: string) => {
    setHiddenModules(prev => {
      if (prev.includes(moduleId)) {
        // Remove from hidden list
        return prev.filter(id => id !== moduleId);
      } else {
        // Add to hidden list
        return [...prev, moduleId];
      }
    });
  };

  const handleToggleRounding = (enabled: boolean) => {
    setStack({
      ...stack,
      roundToNearest100: enabled
    });
  };

  const handleViewSummary = () => {
    if (hiddenModules.length > 0) {
      toast({
        title: "Hidden modules detected",
        description: "Please include all modules before proceeding to the summary page.",
        variant: "destructive"
      });
      return;
    }
    
    if (onViewSummary) {
      onViewSummary();
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <ModuleListHeader 
          title="Costing Review & Pricing" 
          tooltip="Review costs and determine your final pricing strategy. Set additional costs, profit margins, and contingency buffers."
        />
      </div>
      
      <div className="flex justify-start mb-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-1 border-gray-200 hover:bg-black hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Builder
        </Button>
      </div>
      
      <CollapsedModuleList 
        modules={stack.modules} 
        onEditModule={onEditModule}
        currencySymbol={currencySymbol}
        hiddenModules={hiddenModules}
        onToggleHiddenModule={handleToggleHiddenModule}
      />
      
      <ValueCaptureForm 
        stack={simulatedStack} 
        setStack={setStack}
        currencySymbol={currencySymbol}
      />

      <PricingSummary 
        stack={simulatedStack} 
        currencySymbol={currencySymbol} 
        title="Costing and Pricing Preview"
        onToggleRounding={handleToggleRounding}
      />

      {onViewSummary && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleViewSummary}
            className="bg-black hover:bg-black/80 flex items-center gap-1"
            disabled={hiddenModules.length > 0}
          >
            {hiddenModules.length > 0 ? (
              "Include all modules to continue"
            ) : (
              <>
                <ArrowRight size={16} />
                View Summary
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PricingView;
