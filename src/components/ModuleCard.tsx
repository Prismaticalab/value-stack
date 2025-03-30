
import React, { useState, useRef } from "react";
import { Module } from "@/types/stack";
import { Draggable } from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Copy, Trash2, Flag, Star, Paperclip, X, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Here you would normally upload the file to a server and get a URL back
    // For this example, we'll create an object URL
    const documentUrl = URL.createObjectURL(file);
    
    handleChange('documentUrl', documentUrl);
    handleChange('documentName', file.name);
    
    toast({
      title: "Document attached",
      description: `"${file.name}" has been attached to this module.`
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeDocument = () => {
    handleChange('documentUrl', undefined);
    handleChange('documentName', undefined);
    
    toast({
      title: "Document removed",
      description: "The document has been removed from this module."
    });
  };

  // Calculate the displayed cost based on cost type
  const displayedCost = module.costType === 'variable' && module.costQuantity 
    ? module.cost * module.costQuantity 
    : module.cost;

  // Determine the color accent based on stakeholder and non-negotiable status
  const getCardClasses = () => {
    let borderColor = "";
    
    if (module.nonNegotiable) {
      if (module.stakeholder === 'internal') {
        borderColor = "border-l-4 border-l-blue-500";
      } else {
        borderColor = "border-l-4 border-l-purple-500";
      }
    } else if (module.stakeholder === 'internal') {
      borderColor = "border-l-4 border-l-blue-500";
    } else if (module.stakeholder === 'external') {
      borderColor = "border-l-4 border-l-purple-500";
    }
    
    return `border border-gray-200 shadow-sm transition-all ${borderColor}`;
  };

  return (
    <Draggable draggableId={module.id} index={index} isDragDisabled={isLocked}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={getCardClasses()}
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
                    onFocus={(e) => e.target.placeholder = ""}
                    onBlur={(e) => e.target.placeholder = "Module name"}
                  />
                  
                  {/* Non-negotiable star indicator */}
                  {module.nonNegotiable && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-yellow-500">
                            <Star size={18} fill="currentColor" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Non-negotiable module (cannot be deleted)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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
                  <Label className="text-sm font-medium mb-1 block">Purpose of Module</Label>
                  <Textarea
                    className="w-full border-gray-200 focus:border-black focus:ring-black"
                    placeholder="Describe the purpose of this module..."
                    value={module.value}
                    onChange={(e) => handleChange("value", e.target.value)}
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
                    <div className="flex items-center">
                      <Label className="text-sm font-medium mr-4">Cost</Label>
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
                          onFocus={(e) => e.target.placeholder = ""}
                          onBlur={(e) => e.target.placeholder = "Unit (e.g., hours, users)"}
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
                
                {/* Document attachment section */}
                <div className="pt-4">
                  <Label className="text-sm font-medium mb-2 block">Document Attachment</Label>
                  
                  {module.documentUrl ? (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <Paperclip size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm truncate max-w-xs">{module.documentName}</span>
                      </div>
                      <div className="flex space-x-2">
                        {/* Link to open document */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => window.open(module.documentUrl, '_blank')}
                              >
                                <ExternalLink size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {/* Button to remove document */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={removeDocument}
                                disabled={isLocked}
                              >
                                <X size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-gray-300 text-gray-500 hover:text-gray-700"
                      onClick={triggerFileInput}
                      disabled={isLocked}
                    >
                      <Paperclip size={16} className="mr-2" />
                      Attach Document
                    </Button>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  />
                </div>
                
                {/* Non-negotiable setting with aligned toggle */}
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
