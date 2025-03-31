
import { useState, useEffect } from "react";
import { Stack, Module } from "@/types/stack";
import { useToast } from "@/hooks/use-toast";

export const useModuleManager = (stack: Stack, setStack: (stack: Stack) => void) => {
  const { toast } = useToast();
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{[key: string]: boolean}>({});
  const [newModuleId, setNewModuleId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<{[key: string]: boolean}>({});

  // Handle expansion of modules whenever modules list changes or a new module is added
  useEffect(() => {
    if (stack.modules.length > 0) {
      // Create an object to track which modules should be expanded
      const expandedState: {[key: string]: boolean} = { ...expandedModules };
      
      // If we have a newly added module ID, set only that one to expanded
      if (newModuleId && stack.modules.find(mod => mod.id === newModuleId)) {
        expandedState[newModuleId] = true;
      }
      
      // For any module IDs that don't exist in expandedModules yet, add them as collapsed
      stack.modules.forEach(module => {
        if (expandedState[module.id] === undefined) {
          expandedState[module.id] = false;
        }
      });
      
      // Remove any modules that no longer exist
      Object.keys(expandedState).forEach(id => {
        if (!stack.modules.find(mod => mod.id === id)) {
          delete expandedState[id];
        }
      });
      
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

  const setModuleExpanded = (moduleId: string, expanded: boolean) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: expanded
    }));
  };

  const handleSaveModule = (moduleId: string) => {
    // When a module is saved, collapse it
    setModuleExpanded(moduleId, false);
    
    // Show success toast
    toast({
      title: "Module Saved",
      description: "Your changes have been saved successfully.",
      duration: 3000,
    });
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
    handleSaveModule
  };
};
