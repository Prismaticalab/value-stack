
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Module } from "@/types/stack";

interface DialogFooterActionsProps {
  onCancel: () => void;
  onSave: (module: Module) => void;
  module: Module;
}

const DialogFooterActions = ({ onCancel, onSave, module }: DialogFooterActionsProps) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button onClick={() => onSave(module)} className="hover:bg-black hover:text-white transition-colors">
        Save Changes
      </Button>
    </DialogFooter>
  );
};

export default DialogFooterActions;
