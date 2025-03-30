
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ModuleCard from "./ModuleCard";
import ValueCaptureForm from "./ValueCaptureForm";
import { Stack, Module } from "@/types/stack";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Plus, Save, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StackBuilderProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onSave: () => void;
  onViewSummary: () => void;
  currencySymbol: string;
}

const StackBuilder = ({ stack, setStack, onSave, onViewSummary, currencySymbol }: StackBuilderProps) => {
  const [valueCaptureView, setValueCaptureView] = useState(false);
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

  const updateModule = (moduleId: string, updatedModule: Module) => {
    setStack({
      ...stack,
      modules: stack.modules.map(mod => 
        mod.id === moduleId ? updatedModule : mod
      )
    });
  };

  const deleteModule = (moduleId: string) => {
    const moduleToDelete = stack.modules.find(mod => mod.id === moduleId);
    
    if (moduleToDelete && moduleToDelete.nonNegotiable) {
      toast({
        title: "Cannot Delete Non-Negotiable Module",
        description: "This module is marked as non-negotiable and cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    setStack({
      ...stack,
      modules: stack.modules.filter(mod => mod.id !== moduleId)
    });
  };

  const duplicateModule = (moduleId: string) => {
    const moduleToDuplicate = stack.modules.find(mod => mod.id === moduleId);
    if (!moduleToDuplicate) return;

    const duplicatedModule = {
      ...moduleToDuplicate,
      id: crypto.randomUUID()
    };

    setStack({
      ...stack,
      modules: [...stack.modules, duplicatedModule]
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(stack.modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStack({
      ...stack,
      modules: items
    });
  };

  const goToPricing = () => {
    setValueCaptureView(true);
    toast({
      title: "Ready to set pricing",
      description: "Now you can set your pricing and margins."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-medium">Stack Builder</h2>
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Modules</h2>
          </div>

          {stack.modules.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
              <p className="text-gray-500 mb-4">No modules added yet</p>
              <Button 
                onClick={addNewModule}
                className="bg-black hover:bg-black/80"
              >
                Add Your First Module
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="modules">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {stack.modules.map((module, index) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        index={index}
                        onUpdate={updateModule}
                        onDelete={deleteModule}
                        onDuplicate={duplicateModule}
                        currencySymbol={currencySymbol}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          
          {stack.modules.length > 0 && (
            <div className="flex justify-center mt-6">
              <Button 
                className="bg-black hover:bg-black/80 flex items-center gap-1 mr-4"
                onClick={addNewModule}
              >
                <Plus size={16} />
                Add Module
              </Button>
              
              <Button 
                className="bg-black hover:bg-black/80 flex items-center gap-1"
                onClick={goToPricing}
              >
                <ArrowRight size={16} />
                Go to Pricing
              </Button>
            </div>
          )}
          
          {stack.modules.length > 0 && (
            <div className="pt-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Total Delivery Cost:</span>
                <span>{currencySymbol}{stack.totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setValueCaptureView(false)}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Builder
          </Button>
          
          <ValueCaptureForm 
            stack={stack} 
            setStack={setStack}
            currencySymbol={currencySymbol}
          />
        </div>
      )}
    </div>
  );
};

export default StackBuilder;
