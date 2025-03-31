
import React from "react";
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

  const handleToggleRounding = (enabled: boolean) => {
    setStack({
      ...stack,
      roundToNearest100: enabled
    });
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
      />
      
      <ValueCaptureForm 
        stack={stack} 
        setStack={setStack}
        currencySymbol={currencySymbol}
      />

      <PricingSummary 
        stack={stack} 
        currencySymbol={currencySymbol} 
        title="Costing and Pricing Preview"
        onToggleRounding={handleToggleRounding}
      />

      {onViewSummary && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={onViewSummary}
            className="bg-black hover:bg-black/80 flex items-center gap-1"
          >
            <ArrowRight size={16} />
            View Summary
          </Button>
        </div>
      )}
    </div>
  );
};

export default PricingView;
