
import { useState, useEffect } from "react";
import { Stack, Module } from "@/types/stack";

export const useModuleExpansion = (stack: Stack, newModuleId: string | null) => {
  const [expandedModules, setExpandedModules] = useState<{[key: string]: boolean}>({});
  const [originalModules, setOriginalModules] = useState<{[key: string]: Module}>({});

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

  // When a module is expanded, store its original state
  useEffect(() => {
    Object.entries(expandedModules).forEach(([moduleId, isExpanded]) => {
      if (isExpanded) {
        const module = stack.modules.find(m => m.id === moduleId);
        if (module && !originalModules[moduleId]) {
          setOriginalModules(prev => ({
            ...prev,
            [moduleId]: { ...module }
          }));
        }
      }
    });
  }, [expandedModules, stack.modules]);

  const setModuleExpanded = (moduleId: string, expanded: boolean) => {
    // When expanding a module, store its original state for change detection
    if (expanded) {
      const module = stack.modules.find(m => m.id === moduleId);
      if (module) {
        setOriginalModules(prev => ({
          ...prev,
          [moduleId]: { ...module }
        }));
      }
    }
    
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: expanded
    }));
  };

  return {
    expandedModules,
    originalModules,
    setOriginalModules,
    setModuleExpanded
  };
};
