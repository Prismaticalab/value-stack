
import React from "react";
import { Switch } from "@/components/ui/switch";

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
}

const ToggleSwitch = ({ 
  id, 
  checked, 
  onCheckedChange, 
  leftLabel = "Fixed", 
  rightLabel = "%" 
}: ToggleSwitchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-xs ${checked ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
        {leftLabel}
      </span>
      <Switch 
        id={id} 
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked)} 
      />
      <span className={`text-xs ${checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
        {rightLabel}
      </span>
    </div>
  );
};

export default ToggleSwitch;
