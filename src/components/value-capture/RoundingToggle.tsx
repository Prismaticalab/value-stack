
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface RoundingToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const RoundingToggle = ({ enabled, onToggle }: RoundingToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="rounding-toggle" className="text-sm font-medium">
        Round sales price to nearest 100
      </Label>
      <Switch 
        id="rounding-toggle" 
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default RoundingToggle;
