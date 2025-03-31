
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import ModuleCard from "../ModuleCard";
import { Stack, Module } from "@/types/stack";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface DraggableModuleListProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  expandedModules: {[key: string]: boolean};
  setModuleExpanded: (moduleId: string, expanded: boolean) => void;
  onUpdate: (moduleId: string, updatedModule: Module) => void;
  onDelete: (moduleId: string) => void;
  onDuplicate: (moduleId: string) => void;
  newModuleId: string | null;
  currencySymbol: string;
  onSaveModule?: (moduleId: string) => void;
}

const DraggableModuleList = ({
  stack,
  setStack,
  expandedModules,
  setModuleExpanded,
  onUpdate,
  onDelete,
  onDuplicate,
  newModuleId,
  currencySymbol,
  onSaveModule
}: DraggableModuleListProps) => {
  
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {stack.modules.map((module, index) => (
              <div key={module.id} className="relative">
                <ModuleCard
                  key={module.id}
                  module={module}
                  index={index}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  isLocked={stack.locked}
                  currencySymbol={currencySymbol}
                  isExpanded={expandedModules[module.id] || false}
                  setIsExpanded={(expanded) => setModuleExpanded(module.id, expanded)}
                  autoFocus={module.id === newModuleId}
                />
                
                {expandedModules[module.id] && onSaveModule && (
                  <div className="flex justify-end mt-2 mb-4">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                      onClick={() => onSaveModule(module.id)}
                    >
                      <Save size={16} />
                      Save Module
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableModuleList;
