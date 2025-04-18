
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Module } from "@/types/stack";

interface StakeholderTimeSectionProps {
  module: Module;
  onChange: (field: keyof Module, value: any) => void;
}

const StakeholderTimeSection = ({ module, onChange }: StakeholderTimeSectionProps) => {
  const [timeInputActive, setTimeInputActive] = useState(false);
  const [timeInputError, setTimeInputError] = useState<string | null>(null);
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setTimeInputError(null);
      onChange("timeImpact", 0);
      return;
    }
    
    // Check if the value is a valid number
    // Accept both . and , as decimal separators
    const normalizedValue = value.replace(',', '.');
    const numValue = parseFloat(normalizedValue);
    
    if (isNaN(numValue)) {
      setTimeInputError("Please only use numbers for this field");
      return;
    }
    
    setTimeInputError(null);
    onChange("timeImpact", numValue);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Stakeholder</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={module.stakeholder}
            onValueChange={(value) => onChange(
              "stakeholder",
              value as "internal" | "external"
            )}
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
            onChange={(e) => onChange("stakeholderName", e.target.value)}
            onFocus={(e) => e.target.placeholder = ""}
            onBlur={(e) => e.target.placeholder = "Stakeholder name"}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Time Impact <span className="text-red-500">*</span></Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              className="border-gray-200 focus:border-black focus:ring-black"
              type="text"
              inputMode="decimal"
              placeholder={timeInputActive ? "" : "Time value"}
              value={timeInputActive ? module.timeImpact || "" : module.timeImpact === 0 ? "" : module.timeImpact}
              onChange={handleTimeChange}
              onFocus={(e) => {
                setTimeInputActive(true);
                e.target.placeholder = "";
              }}
              onBlur={(e) => {
                setTimeInputActive(false);
                e.target.placeholder = "Time value";
              }}
              required
            />
            {timeInputError && (
              <p className="text-red-500 text-xs mt-1">{timeInputError}</p>
            )}
          </div>

          <Select
            value={module.timeUnit}
            onValueChange={(value) => onChange(
              "timeUnit",
              value as "hours" | "days" | "weeks" | "months"
            )}
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
  );
};

export default StakeholderTimeSection;
