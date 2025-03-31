
import { useState } from "react";
import { Stack, Module } from "@/types/stack";
import { useToast } from "@/hooks/use-toast";

export const useModuleOperations = (stack: Stack, setStack: (stack: Stack) => void) => {
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [newModuleId, setNewModuleId] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleDeleteConfirmed = (cleanupCallback: (moduleId: string) => void) => {
    if (moduleToDelete) {
      setStack({
        ...stack,
        modules: stack.modules.filter(mod => mod.id !== moduleToDelete)
      });
      
      // Clean up state via callback
      cleanupCallback(moduleToDelete);
      
      // Reset module to delete
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

    // Set the new module ID so it will be expanded
    setNewModuleId(newId);

    setStack({
      ...stack,
      modules: [...stack.modules, duplicatedModule]
    });
  };

  const handleAddModule = () => {
    const newId = crypto.randomUUID();
    setNewModuleId(newId);
    
    return newId;
  };

  const updateModule = (moduleId: string, updatedModule: Module, trackChangesCallback: (moduleId: string, updatedModule: Module) => void) => {
    // Track changes via callback
    trackChangesCallback(moduleId, updatedModule);
    
    // Update the stack
    setStack({
      ...stack,
      modules: stack.modules.map(mod => 
        mod.id === moduleId ? updatedModule : mod
      )
    });
  };

  return {
    moduleToDelete,
    newModuleId,
    setNewModuleId,
    updateModule,
    confirmDeleteModule,
    handleDeleteConfirmed,
    duplicateModule,
    handleAddModule,
    setModuleToDelete
  };
};
