
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface ModuleListHeaderProps {
  title?: string;
}

const ModuleListHeader = ({ title }: ModuleListHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      {title && <h2 className="text-xl font-medium">{title}</h2>}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <HelpCircle size={16} className="text-gray-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Add modules that make up your value delivery stack.
              Each module represents a component of your service offering.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ModuleListHeader;
