
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Module } from "@/types/stack";

interface ModuleHeaderProps {
  module: Module;
  onUpdate: (field: keyof Module, value: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  expanded: boolean;
  toggleExpanded: () => void;
  isLocked: boolean;
  displayedCost: number;
  currencySymbol: string;
  onEdit?: () => void;
}

const ModuleHeader = ({
  module,
  onUpdate,
  onDelete,
  onDuplicate,
  expanded,
  toggleExpanded,
  isLocked,
  displayedCost,
  currencySymbol
}: ModuleHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1 mr-4">
        <Label htmlFor={`module-name-${module.id}`} className="text-sm font-medium mb-1 block">Module Name</Label>
        <div className="flex gap-2 items-center">
          <Input
            id={`module-name-${module.id}`}
            className={`font-medium ${!module.name ? 'italic text-gray-400' : ''} border-gray-200 focus:border-black focus:ring-black`}
            placeholder="Module name"
            value={module.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            disabled={isLocked}
            onFocus={(e) => e.target.placeholder = ""}
            onBlur={(e) => e.target.placeholder = "Module name"}
          />
        </div>
      </div>

      <div className="flex items-center">
        <div className="mr-4 text-right">
          <div className="font-medium text-lg">
            {currencySymbol}{displayedCost.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            {module.timeImpact} {module.timeUnit}
          </div>
        </div>

        <div className="flex space-x-1">
          {!isLocked && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-gray-400 hover:text-gray-500 hover:bg-black hover:text-white transition-colors"
                      onClick={onDuplicate}
                    >
                      <Copy size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicate module</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-gray-400 hover:text-gray-500 hover:bg-black hover:text-white transition-colors"
                      onClick={onDelete}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete module</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-gray-400 hover:text-gray-500 hover:bg-black hover:text-white transition-colors"
                  onClick={toggleExpanded}
                >
                  {expanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{expanded ? "Collapse module" : "Expand module"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
