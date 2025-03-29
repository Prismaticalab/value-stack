
import React, { useState } from "react";
import { Module } from "@/types/stack";
import { Draggable } from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Copy, Trash2, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModuleCardProps {
  module: Module;
  index: number;
  onUpdate: (id: string, module: Module) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isLocked: boolean;
  currencySymbol: string;
}

const ModuleCard = ({
  module,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  isLocked,
  currencySymbol
}: ModuleCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field: keyof Module, value: any) => {
    const updatedModule = { ...module, [field]: value };
    onUpdate(module.id, updatedModule);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleNonNegotiable = () => {
    handleChange('nonNegotiable', !module.nonNegotiable);
  };

  // Calculate the displayed cost based on cost type
  const displayedCost = module.costType === 'variable' && module.costQuantity 
    ? module.cost * module.costQuantity 
    : module.cost;

  return (
    <Draggable draggableId={module.id} index={index} isDragDisabled={isLocked}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`border border-gray-200 shadow-sm transition-all ${module.nonNegotiable ? 'border-l-4 border-l-red-500' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-4">
                <div className="flex gap-2 items-center">
                  <Input
                    className={`font-medium ${!module.name ? 'italic text-gray-400' : ''} border-gray-200 focus:border-black focus:ring-black`}
                    placeholder="Module name"
                    value={module.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={isLocked}
                  />
                  
                  {/* Non-negotiable flag toggle */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-full ${module.nonNegotiable ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'}`}
                          onClick={toggleNonNegotiable}
                          disabled={isLocked}
                        >
                          <Flag size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as non-negotiable {module.nonNegotiable ? '(cannot be deleted)' : ''}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => onDuplicate(module.id)}
                      >
                        <Copy size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-gray-400 hover:text-red-500"
                        onClick={() => onDelete(module.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-gray-400 hover:text-gray-500"
                    onClick={toggleExpanded}
                  >
                    {expanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {expanded && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-1 block">Value Proposition</Label>
                  <Textarea
                    className="w-full border-gray-200 focus:border-black focus:ring-black"
                    placeholder="Describe the value of this module..."
                    value={module.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    disabled={isLocked}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Stakeholder</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Select
                        value={module.stakeholder}
                        onValueChange={(value) =>
                          handleChange(
                            "stakeholder",
                            value as "internal" | "external"
                          )
                        }
                        disabled={isLocked}
                      >
                        <SelectTrigger className="border-gray-200 focus:ring-black">
                          <SelectValue placeholder="Select stakeholder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        className="border-gray-200 focus:border-black focus:ring-black"
                        placeholder="Stakeholder name"
                        value={module.stakeholderName}
                        onChange={(e) =>
                          handleChange("stakeholderName", e.target.value)
                        }
                        disabled={isLocked}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1 block">Time Impact</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        className="border-gray-200 focus:border-black focus:ring-black"
                        type="number"
                        min="0"
                        step="1"
                        value={module.timeImpact}
                        onChange={(e) =>
                          handleChange("timeImpact", parseInt(e.target.value) || 0)
                        }
                        disabled={isLocked}
                      />

                      <Select
                        value={module.timeUnit}
                        onValueChange={(value) =>
                          handleChange(
                            "timeUnit",
                            value as "minutes" | "hours" | "days" | "weeks" | "months"
                          )
                        }
                        disabled={isLocked}
                      >
                        <SelectTrigger className="border-gray-200 focus:ring-black">
                          <SelectValue placeholder="Select time unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Cost</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Fixed</span>
                      <Switch
                        checked={module.costType === "variable"}
                        onCheckedChange={(checked) =>
                          handleChange(
                            "costType",
                            checked ? "variable" : "fixed"
                          )
                        }
                        disabled={isLocked}
                      />
                      <span className="text-xs text-gray-500">Variable</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">{currencySymbol}</span>
                      </div>
                      <Input
                        className="pl-7 border-gray-200 focus:border-black focus:ring-black"
                        type="number"
                        min="0"
                        step="0.01"
                        value={module.cost}
                        onChange={(e) =>
                          handleChange("cost", parseFloat(e.target.value) || 0)
                        }
                        disabled={isLocked}
                      />
                    </div>

                    {module.costType === "variable" && (
                      <>
                        <Input
                          className="border-gray-200 focus:border-black focus:ring-black"
                          placeholder="Unit (e.g., hours, users)"
                          value={module.costUnit || ""}
                          onChange={(e) =>
                            handleChange("costUnit", e.target.value)
                          }
                          disabled={isLocked}
                        />

                        <Input
                          className="border-gray-200 focus:border-black focus:ring-black"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Quantity"
                          value={module.costQuantity || 1}
                          onChange={(e) =>
                            handleChange(
                              "costQuantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          disabled={isLocked}
                        />
                      </>
                    )}
                  </div>
                </div>
                
                {/* Non-negotiable setting with tooltip */}
                <div className="pt-2 flex items-center justify-between">
                  <Label htmlFor={`non-negotiable-${module.id}`} className="cursor-pointer flex items-center gap-2">
                    <span>Non-Negotiable</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help text-gray-400 hover:text-gray-500">
                          <Flag size={14} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>When marked as non-negotiable, this module cannot be deleted.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Switch
                    id={`non-negotiable-${module.id}`}
                    checked={module.nonNegotiable || false}
                    onCheckedChange={(checked) => handleChange("nonNegotiable", checked)}
                    disabled={isLocked}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default ModuleCard;
