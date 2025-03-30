
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Module } from "@/types/stack";

interface ModuleDetailsProps {
  module: Module;
  onUpdate: (field: keyof Module, value: any) => void;
  isLocked: boolean;
}

const ModuleDetails = ({ module, onUpdate, isLocked }: ModuleDetailsProps) => {
  const [timeInputActive, setTimeInputActive] = useState(false);
  
  return (
    <div className="mt-4 space-y-4">
      <div>
        <Label className="text-sm font-medium mb-1 block">Purpose of Module</Label>
        <Textarea
          className="w-full border-gray-200 focus:border-black focus:ring-black"
          placeholder="Describe the purpose of this module..."
          value={module.value}
          onChange={(e) => onUpdate("value", e.target.value)}
          disabled={isLocked}
          onFocus={(e) => e.target.placeholder = ""}
          onBlur={(e) => e.target.placeholder = "Describe the purpose of this module..."}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium mb-1 block">Stakeholder</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Select
              value={module.stakeholder}
              onValueChange={(value) =>
                onUpdate(
                  "stakeholder",
                  value as "internal" | "external"
                )
              }
              disabled={isLocked}
            >
              <SelectTrigger className="border-gray-200 focus:ring-black">
                <SelectValue placeholder="Select stakeholder" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>

            <Input
              className="border-gray-200 focus:border-black focus:ring-black"
              placeholder="Stakeholder name"
              value={module.stakeholderName}
              onChange={(e) =>
                onUpdate("stakeholderName", e.target.value)
              }
              disabled={isLocked}
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Stakeholder name"}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-1 block">Time Impact</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              className="border-gray-200 focus:border-black focus:ring-black"
              type="text" 
              inputMode="numeric"
              placeholder={timeInputActive ? "" : "Time value"}
              value={module.timeImpact || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  onUpdate("timeImpact", value === '' ? 0 : parseInt(value));
                }
              }}
              disabled={isLocked}
              onFocus={() => setTimeInputActive(true)}
              onBlur={() => setTimeInputActive(false)}
            />

            <Select
              value={module.timeUnit}
              onValueChange={(value) =>
                onUpdate(
                  "timeUnit",
                  value as "hours" | "days" | "weeks" | "months"
                )
              }
              disabled={isLocked}
            >
              <SelectTrigger className="border-gray-200 focus:ring-black">
                <SelectValue placeholder="Select time unit" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetails;
