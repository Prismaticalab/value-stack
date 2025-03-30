
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import ModuleCard from "../ModuleCard";
import { Stack, Module } from "@/types/stack";
import { Button } from "@/components/ui/button";
import { Plus, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModuleListProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onAddModule: () => void;
  onGoToPricing: () => void;
  onEditModule: (moduleId: string) => void;
  currencySymbol: string;
}

const ModuleList = ({ 
  stack, 
  setStack, 
  onAddModule, 
  onGoToPricing, 
  onEditModule,
  currencySymbol 
}: ModuleListProps) => {
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Modules</h2>
      </div>

      {stack.modules.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
          <p className="text-gray-500 mb-4">No modules added yet</p>
          <Button 
            onClick={onAddModule}
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
                    isLocked={stack.locked}
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
            onClick={onAddModule}
          >
            <Plus size={16} />
            Add Module
          </Button>
          
          <Button 
            className="bg-black hover:bg-black/80 flex items-center gap-1"
            onClick={onGoToPricing}
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
  );
};

export default ModuleList;
