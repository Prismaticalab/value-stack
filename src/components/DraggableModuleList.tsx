
import React from "react";
import { Stack } from "@/types/stack";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ModuleCard from "@/components/ModuleCard";

interface DraggableModuleListProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  expandedModules: Record<string, boolean>;
  setModuleExpanded: (moduleId: string, expanded: boolean) => void;
  onUpdate: (moduleId: string, updatedModule: any) => void;
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
            className="space-y-4 w-full"
          >
            {stack.modules.map((module, index) => (
              <Draggable
                key={module.id}
                draggableId={module.id}
                index={index}
                isDragDisabled={stack.locked}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? "opacity-70" : ""} w-full`}
                  >
                    <ModuleCard
                      module={module}
                      index={index}
                      isExpanded={expandedModules[module.id] || false}
                      setIsExpanded={(expanded) => setModuleExpanded(module.id, expanded)}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onDuplicate={onDuplicate}
                      isLocked={stack.locked}
                      currencySymbol={currencySymbol}
                      autoFocus={module.id === newModuleId}
                      onSave={onSaveModule}
                    />
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
