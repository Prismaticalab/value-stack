
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Module } from "@/types/stack";
import EditDialogHeader from "./EditDialogHeader";
import BasicModuleInfo from "./BasicModuleInfo";
import StakeholderTimeSection from "./StakeholderTimeSection";
import CostSection from "./CostSection";
import DocumentSection from "./DocumentSection";
import DialogFooterActions from "./DialogFooterActions";

interface ModuleEditDialogProps {
  module: Module;
  onSave: (updatedModule: Module) => void;
  onCancel: () => void;
  currencySymbol: string;
}

const ModuleEditDialog = ({ module, onSave, onCancel, currencySymbol }: ModuleEditDialogProps) => {
  const [editedModule, setEditedModule] = useState<Module>({ ...module });

  const handleChange = (field: keyof Module, value: any) => {
    setEditedModule({ ...editedModule, [field]: value });
  };

  const handleDocumentChange = (documentUrl?: string, documentName?: string) => {
    setEditedModule({
      ...editedModule,
      documentUrl,
      documentName
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <EditDialogHeader />
        
        <div className="grid gap-4 py-4">
          <BasicModuleInfo 
            module={editedModule} 
            onChange={handleChange} 
          />
          
          <StakeholderTimeSection 
            module={editedModule} 
            onChange={handleChange} 
          />
          
          <CostSection 
            module={editedModule} 
            onChange={handleChange} 
            currencySymbol={currencySymbol} 
          />
          
          <DocumentSection 
            documentUrl={editedModule.documentUrl} 
            documentName={editedModule.documentName} 
            onDocumentChange={handleDocumentChange} 
          />
        </div>
        
        <DialogFooterActions 
          onCancel={onCancel} 
          onSave={onSave} 
          module={editedModule} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModuleEditDialog;
