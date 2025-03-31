
import React from "react";
import { Stack } from "@/types/stack";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import ModuleCard from "@/components/ModuleCard";

interface DraggableModuleListProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  expandedModules: Record<string, boolean>;
  setModuleExpanded: (moduleId: string, expanded: boolean) => void;
  onUpdate: (moduleId: string, field: string, value: any) => void;
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
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(stack.modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStack({
      ...stack,
      modules: items,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {stack.modules.map((module, index) => (
              <Draggable
                key={module.id}
                draggableId={module.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                  >
                    <div className="relative">
                      <ModuleCard
                        module={module}
                        index={index}
                        isExpanded={expandedModules[module.id] || false}
                        setIsExpanded={(expanded) => setModuleExpanded(module.id, expanded)}
                        onUpdate={(field, value) =>
                          onUpdate(module.id, field, value)
                        }
                        onDelete={() => onDelete(module.id)}
                        onDuplicate={() => onDuplicate(module.id)}
                        isNew={module.id === newModuleId}
                        isLocked={stack.locked}
                        currencySymbol={currencySymbol}
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
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableModuleList;
