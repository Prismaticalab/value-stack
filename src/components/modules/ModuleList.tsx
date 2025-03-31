
import { Stack } from "@/types/stack";
import { useModuleManager } from "@/hooks/useModuleManager";
import ModuleListHeader from "./ModuleListHeader";
import EmptyModuleState from "./EmptyModuleState";
import DraggableModuleList from "./DraggableModuleList";
import ModuleActions from "./ModuleActions";
import TotalCostDisplay from "./TotalCostDisplay";
import DeleteModuleDialog from "./DeleteModuleDialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ModuleListProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onAddModule: () => void;
  onGoToPricing: () => void;
  onEditModule: (moduleId: string) => void;
  currencySymbol: string;
  onSave?: () => void;
}

const ModuleList = ({ 
  stack, 
  setStack, 
  onAddModule, 
  onGoToPricing, 
  onEditModule,
  currencySymbol,
  onSave
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
    handleAddModule,
    setModuleExpanded,
    setModuleToDelete
  } = useModuleManager(stack, setStack);

  const handleCreateModule = () => {
    // Get the new module ID from the hook
    const newId = handleAddModule();
    
    // Create a new module object
    const newModule = {
      id: newId,
      name: "",
      value: "",
      stakeholder: "internal" as const,
      stakeholderName: "",
      costType: "fixed" as const, 
      cost: 0,
      costUnit: "",
      costQuantity: 1,
      timeImpact: 1,
      timeUnit: "days" as const,
      nonNegotiable: false
    };
    
    // Add it to the stack
    setStack({
      ...stack,
      modules: [...stack.modules, newModule]
    });
    
    // Call the parent's onAddModule for any additional handling
    onAddModule();
  };

  const handleSaveModule = (moduleId: string) => {
    // When a module is saved, collapse it
    setModuleExpanded(moduleId, false);
  };

  return (
    <div className="space-y-4">
      <ModuleListHeader title="Modules" />

      {stack.modules.length === 0 ? (
        <EmptyModuleState onAddModule={handleCreateModule} />
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
          onSaveModule={handleSaveModule}
        />
      )}
      
      <div className="flex flex-col space-y-4">
        {stack.modules.length > 0 && (
          <TotalCostDisplay
            totalCost={stack.totalCost}
            currencySymbol={currencySymbol}
          />
        )}
        
        {onSave && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              onClick={onSave}
              className="flex items-center gap-1 border-gray-200 hover:bg-black hover:text-white transition-colors"
            >
              <Save size={16} />
              Save Progress
            </Button>
          </div>
        )}
      </div>
      
      {stack.modules.length > 0 && (
        <ModuleActions
          onAddModule={handleCreateModule}
          onGoToPricing={onGoToPricing}
          pricingButtonText="Go to Costing Review & Pricing"
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
