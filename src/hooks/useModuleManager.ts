
import { Stack, Module } from "@/types/stack";
import { useModuleExpansion } from "./useModuleExpansion";
import { useModuleChanges } from "./useModuleChanges";
import { useModuleOperations } from "./useModuleOperations";

export const useModuleManager = (stack: Stack, setStack: (stack: Stack) => void) => {
  const {
    newModuleId,
    setNewModuleId,
    updateModule: baseUpdateModule,
    confirmDeleteModule,
    handleDeleteConfirmed: baseHandleDeleteConfirmed,
    duplicateModule,
    handleAddModule,
    setModuleToDelete,
    moduleToDelete
  } = useModuleOperations(stack, setStack);

  const {
    expandedModules,
    originalModules,
    setOriginalModules,
    setModuleExpanded
  } = useModuleExpansion(stack, newModuleId);

  const {
    hasUnsavedChanges,
    trackModuleChanges,
    handleSaveModule: baseSaveModule,
    cleanupModuleChanges,
    checkModuleHasChanges
  } = useModuleChanges(originalModules, setOriginalModules);

  // Connect the hooks together with these wrapper functions
  const updateModule = (moduleId: string, updatedModule: Module) => {
    baseUpdateModule(moduleId, updatedModule, trackModuleChanges);
  };

  const handleDeleteConfirmed = () => {
    baseHandleDeleteConfirmed(cleanupModuleChanges);
  };

  const handleSaveModule = (moduleId: string) => {
    const module = stack.modules.find(m => m.id === moduleId);
    if (module) {
      baseSaveModule(moduleId, module);
    }
    
    // When a module is saved, collapse it
    setModuleExpanded(moduleId, false);
  };

  return {
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
    setModuleToDelete,
    handleSaveModule,
    checkModuleHasChanges,
    hasUnsavedChanges
  };
};
