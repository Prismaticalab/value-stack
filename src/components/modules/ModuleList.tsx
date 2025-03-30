
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import ModuleCard from "../ModuleCard";
import { Stack, Module } from "@/types/stack";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{[key: string]: boolean}>({});
  const [newModuleId, setNewModuleId] = useState<string | null>(null);

  // Initialize expanded state for all modules
  useEffect(() => {
    const expandedState: {[key: string]: boolean} = {};
    stack.modules.forEach(module => {
      // If a module is newly added, it should be expanded, others collapsed
      expandedState[module.id] = module.id === newModuleId;
    });
    
    if (Object.keys(expandedState).length > 0) {
      setExpandedModules(expandedState);
    }
  }, [stack.modules.length, newModuleId]);

  const updateModule = (moduleId: string, updatedModule: Module) => {
    setStack({
      ...stack,
      modules: stack.modules.map(mod => 
        mod.id === moduleId ? updatedModule : mod
      )
    });
  };

  const confirmDeleteModule = (moduleId: string) => {
    const moduleToDelete = stack.modules.find(mod => mod.id === moduleId);
    
    if (moduleToDelete && moduleToDelete.nonNegotiable) {
      toast({
        title: "Cannot Delete Non-Negotiable Module",
        description: "This module is marked as non-negotiable and cannot be deleted.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    setModuleToDelete(moduleId);
  };

  const handleDeleteConfirmed = () => {
    if (moduleToDelete) {
      setStack({
        ...stack,
        modules: stack.modules.filter(mod => mod.id !== moduleToDelete)
      });
      setModuleToDelete(null);
    }
  };

  const duplicateModule = (moduleId: string) => {
    const moduleToDuplicate = stack.modules.find(mod => mod.id === moduleId);
    if (!moduleToDuplicate) return;

    const newId = crypto.randomUUID();
    const duplicatedModule = {
      ...moduleToDuplicate,
      id: newId
    };

    // Collapse all modules and expand only the new one
    const newExpandedState: {[key: string]: boolean} = {};
    stack.modules.forEach(mod => {
      newExpandedState[mod.id] = false;
    });
    newExpandedState[newId] = true;
    setExpandedModules(newExpandedState);
    setNewModuleId(newId);

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

  const handleAddModule = () => {
    const newId = crypto.randomUUID();
    setNewModuleId(newId);
    
    // Collapse all existing modules
    const newExpandedState: {[key: string]: boolean} = {};
    stack.modules.forEach(mod => {
      newExpandedState[mod.id] = false;
    });
    // The new module will be expanded in the useEffect when it's added to stack.modules
    setExpandedModules(newExpandedState);
    
    onAddModule();
  };

  const setModuleExpanded = (moduleId: string, expanded: boolean) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: expanded
    }));
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
            onClick={handleAddModule}
            className="bg-black hover:bg-black/80 transition-colors"
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
                    onDelete={confirmDeleteModule}
                    onDuplicate={duplicateModule}
                    isLocked={stack.locked}
                    currencySymbol={currencySymbol}
                    isExpanded={expandedModules[module.id] || false}
                    setIsExpanded={(expanded) => setModuleExpanded(module.id, expanded)}
                    autoFocus={module.id === newModuleId}
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
            className="bg-black hover:bg-black/80 transition-colors flex items-center gap-1 mr-4"
            onClick={handleAddModule}
          >
            <Plus size={16} />
            <span>Add Module</span>
          </Button>
          
          <Button 
            className="bg-black hover:bg-black/80 transition-colors flex items-center gap-1"
            onClick={onGoToPricing}
          >
            <ArrowRight size={16} />
            <span>Go to Pricing</span>
          </Button>
        </div>
      )}
      
      {stack.modules.length > 0 && (
        <div className="pt-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Current Value Delivery Cost:</span>
            <span>{currencySymbol}{stack.totalCost.toFixed(2)}</span>
          </div>
        </div>
      )}

      <AlertDialog open={moduleToDelete !== null} onOpenChange={(open) => !open && setModuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this module?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the module and its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModuleList;
