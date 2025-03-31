
import { useState } from "react";
import { Module } from "@/types/stack";
import { useToast } from "@/hooks/use-toast";

export const useModuleChanges = (originalModules: {[key: string]: Module}, setOriginalModules: (modules: {[key: string]: Module}) => void) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<{[key: string]: boolean}>({});
  const [editedModules, setEditedModules] = useState<{[key: string]: Module}>({});
  const { toast } = useToast();

  const checkModuleHasChanges = (moduleId: string) => {
    return hasUnsavedChanges[moduleId] || false;
  };

  const trackModuleChanges = (moduleId: string, updatedModule: Module) => {
    // When a module is updated, store it in editedModules
    setEditedModules(prev => ({
      ...prev,
      [moduleId]: updatedModule
    }));
    
    // Check if this module has unsaved changes
    if (originalModules[moduleId]) {
      const original = originalModules[moduleId];
      let hasChanges = false;
      
      // Compare properties excluding id
      Object.keys(original).forEach(key => {
        if (key !== 'id' && JSON.stringify(original[key as keyof Module]) !== JSON.stringify(updatedModule[key as keyof Module])) {
          hasChanges = true;
        }
      });
      
      setHasUnsavedChanges(prev => ({
        ...prev,
        [moduleId]: hasChanges
      }));
    }
  };

  const handleSaveModule = (moduleId: string, module: Module) => {
    // Reset change detection state
    setHasUnsavedChanges(prev => ({
      ...prev,
      [moduleId]: false
    }));
    
    // Update the original module reference
    setOriginalModules(prev => ({
      ...prev,
      [moduleId]: { ...module }
    }));
    
    // Show success toast
    toast({
      title: "Module Saved",
      description: "Your changes have been saved successfully.",
      duration: 3000,
    });
  };

  const cleanupModuleChanges = (moduleId: string) => {
    setHasUnsavedChanges(prev => {
      const newState = { ...prev };
      delete newState[moduleId];
      return newState;
    });
    
    setEditedModules(prev => {
      const newState = { ...prev };
      delete newState[moduleId];
      return newState;
    });
  };

  return {
    hasUnsavedChanges,
    trackModuleChanges,
    handleSaveModule,
    cleanupModuleChanges,
    checkModuleHasChanges
  };
};
