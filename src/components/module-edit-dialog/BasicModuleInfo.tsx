
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Module } from "@/types/stack";
import NonNegotiableToggle from "../modules/card/NonNegotiableToggle";

interface BasicModuleInfoProps {
  module: Module;
  onChange: (field: keyof Module, value: any) => void;
}

const BasicModuleInfo = ({ module, onChange }: BasicModuleInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="edit-name">Module Name</Label>
        <Input
          id="edit-name"
          value={module.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="border-gray-200 focus:border-black focus:ring-black"
          placeholder="Module name"
          onFocus={(e) => e.target.placeholder = ""}
          onBlur={(e) => e.target.placeholder = "Module name"}
        />
      </div>
      
      <NonNegotiableToggle 
        id={module.id}
        checked={module.nonNegotiable || false}
        onChange={(checked) => onChange("nonNegotiable", checked)}
        isLocked={false}
      />
      
      <div className="space-y-2">
        <Label htmlFor="edit-value">Purpose of Module</Label>
        <Textarea
          id="edit-value"
          value={module.value}
          onChange={(e) => onChange("value", e.target.value)}
          className="border-gray-200 focus:border-black focus:ring-black min-h-24"
          placeholder="Describe the purpose of this module..."
          onFocus={(e) => e.target.placeholder = ""}
          onBlur={(e) => e.target.placeholder = "Describe the purpose of this module..."}
        />
      </div>
    </>
  );
};

export default BasicModuleInfo;
