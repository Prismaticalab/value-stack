
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import ModuleCard from "../ModuleCard";
import { Stack, Module } from "@/types/stack";

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
            className="space-y-3 w-full"
          >
            {stack.modules.map((module, index) => (
              <div key={module.id} className="relative w-full">
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
                  onSave={onSaveModule}
                />
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
