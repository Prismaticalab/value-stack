
import React from "react";
import { Stack } from "@/types/stack";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ModuleList from "../modules/ModuleList";

interface ModuleBuilderViewProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onGoToPricing: () => void;
  onEditModule: (moduleId: string) => void;
  currencySymbol: string;
  onSave: () => void;
}

const ModuleBuilderView = ({
  stack,
  setStack,
  onGoToPricing,
  onEditModule,
  currencySymbol,
  onSave
}: ModuleBuilderViewProps) => {
  const addNewModule = () => {
    // This function is now just a placeholder as the actual module creation
    // is handled in the ModuleList component
  };

  return (
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
        onGoToPricing={onGoToPricing}
        onEditModule={onEditModule}
        currencySymbol={currencySymbol}
        onSave={onSave}
      />
    </>
  );
};

export default ModuleBuilderView;
