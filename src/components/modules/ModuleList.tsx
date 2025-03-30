
import { Stack } from "@/types/stack";
import { useModuleManager } from "@/hooks/useModuleManager";
import ModuleListHeader from "./ModuleListHeader";
import EmptyModuleState from "./EmptyModuleState";
import DraggableModuleList from "./DraggableModuleList";
import ModuleActions from "./ModuleActions";
import TotalCostDisplay from "./TotalCostDisplay";
import DeleteModuleDialog from "./DeleteModuleDialog";

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
  const {
    moduleToDelete,
    expandedModules,
    newModuleId,
    setNewModuleId,
    updateModule,
    confirmDeleteModule,
    handleDeleteConfirmed,
    duplicateModule,
    setModuleExpanded,
    setModuleToDelete
  } = useModuleManager(stack, setStack);

  const handleAddModule = () => {
    const newId = crypto.randomUUID();
    setNewModuleId(newId);
    onAddModule();
  };

  return (
    <div className="space-y-4">
      <ModuleListHeader title="Modules" />

      {stack.modules.length === 0 ? (
        <EmptyModuleState onAddModule={handleAddModule} />
      ) : (
        <DraggableModuleList
          stack={stack}
          setStack={setStack}
          expandedModules={expandedModules}
          setModuleExpanded={setModuleExpanded}
          onUpdate={updateModule}
          onDelete={confirmDeleteModule}
          onDuplicate={duplicateModule}
          newModuleId={newModuleId}
          currencySymbol={currencySymbol}
        />
      )}
      
      {stack.modules.length > 0 && (
        <ModuleActions
          onAddModule={handleAddModule}
          onGoToPricing={onGoToPricing}
        />
      )}
      
      {stack.modules.length > 0 && (
        <TotalCostDisplay
          totalCost={stack.totalCost}
          currencySymbol={currencySymbol}
        />
      )}

      <DeleteModuleDialog
        open={moduleToDelete !== null}
        onOpenChange={(open) => !open && setModuleToDelete(null)}
        onDelete={handleDeleteConfirmed}
      />
    </div>
  );
};

export default ModuleList;
