
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NonNegotiableToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isLocked: boolean;
}

const NonNegotiableToggle = ({ id, checked, onChange, isLocked }: NonNegotiableToggleProps) => {
  return (
    <div className="mt-3 flex items-center">
      <Label htmlFor={`non-negotiable-${id}`} className="cursor-pointer flex items-center gap-2">
        <span>Non-Negotiable</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-help text-gray-400 hover:text-gray-500">
              <span className="text-xs inline-block bg-gray-100 rounded-full h-4 w-4 text-center">?</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>When marked as non-negotiable, this module cannot be excluded from pricing calculations or deleted.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Switch
        id={`non-negotiable-${id}`}
        checked={checked || false}
        onCheckedChange={onChange}
        disabled={isLocked}
        className="ml-2"
      />
    </div>
  );
};

export default NonNegotiableToggle;
