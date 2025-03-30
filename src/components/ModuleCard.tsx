
import React, { useState, useRef, useEffect } from "react";
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
  // Start with module expanded by default
  const [expanded, setExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [costInputActive, setCostInputActive] = useState(false);
  const [quantityInputActive, setQuantityInputActive] = useState(false);
  const [costInputError, setCostInputError] = useState<string | null>(null);
  const [quantityInputError, setQuantityInputError] = useState<string | null>(null);

  const handleChange = (field: keyof Module, value: any) => {
    const updatedModule = { ...module, [field]: value };
    onUpdate(module.id, updatedModule);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setCostInputError(null);
      handleChange("cost", 0);
      return;
    }
    
    // Check if the value is a valid number
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setCostInputError("Please only use numbers for this field");
      return;
    }
    
    setCostInputError(null);
    handleChange("cost", numValue);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string (to clear the input when typing)
    if (value === '') {
      setQuantityInputError(null);
      handleChange("costQuantity", 1);
      return;
    }
    
    // Check if the value is a valid integer
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      setQuantityInputError("Please only use whole numbers for this field");
      return;
    }
    
    setQuantityInputError(null);
    handleChange("costQuantity", numValue);
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
    
    if (module.stakeholder === 'internal') {
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
                <Label htmlFor={`module-name-${module.id}`} className="text-sm font-medium mb-1 block">Module Name</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id={`module-name-${module.id}`}
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
                        className="rounded-full text-gray-400 hover:text-gray-500 hover:bg-black hover:text-white transition-colors"
                        onClick={() => onDuplicate(module.id)}
                      >
                        <Copy size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-gray-400 hover:text-red-500 hover:bg-black hover:text-white transition-colors"
                        onClick={() => onDelete(module.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </>
                  )}
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
                </div>
              </div>
            </div>

            {/* Non-negotiable setting - next to the text */}
            <div className="mt-3 flex items-center">
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
                className="ml-2"
              />
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
                        type="text" 
                        inputMode="numeric"
                        placeholder="Time value"
                        value={module.timeImpact || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d+$/.test(value)) {
                            handleChange("timeImpact", value === '' ? 0 : parseInt(value));
                          }
                        }}
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
                        <SelectContent className="bg-white">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">{currencySymbol}</span>
                      </div>
                      <Input
                        className="pl-7 border-gray-200 focus:border-black focus:ring-black"
                        type="text"
                        inputMode="decimal"
                        placeholder={costInputActive ? "" : "0"}
                        value={costInputActive ? module.cost || "" : module.cost === 0 ? "" : module.cost}
                        onChange={handleCostChange}
                        onFocus={() => setCostInputActive(true)}
                        onBlur={() => setCostInputActive(false)}
                        disabled={isLocked}
                      />
                      {costInputError && (
                        <p className="text-red-500 text-xs mt-1">{costInputError}</p>
                      )}
                    </div>

                    {module.costType === "variable" && (
                      <>
                        <Input
                          className="border-gray-200 focus:border-black focus:ring-black"
                          placeholder="Type the nature of unit (e.g., hours, users, 1000 copies, etc)"
                          value={module.costUnit || ""}
                          onChange={(e) =>
                            handleChange("costUnit", e.target.value)
                          }
                          disabled={isLocked}
                          onFocus={(e) => e.target.placeholder = ""}
                          onBlur={(e) => e.target.placeholder = "Type the nature of unit (e.g., hours, users, 1000 copies, etc)"}
                        />

                        <div>
                          <Input
                            className="border-gray-200 focus:border-black focus:ring-black"
                            type="text"
                            inputMode="numeric"
                            placeholder={quantityInputActive ? "" : "Number of units needed"}
                            value={quantityInputActive ? module.costQuantity || "" : module.costQuantity || ""}
                            onChange={handleQuantityChange}
                            disabled={isLocked}
                            onFocus={(e) => {
                              setQuantityInputActive(true);
                              e.target.placeholder = "";
                            }}
                            onBlur={(e) => {
                              setQuantityInputActive(false);
                              e.target.placeholder = "Number of units needed";
                            }}
                          />
                          {quantityInputError && (
                            <p className="text-red-500 text-xs mt-1">{quantityInputError}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Document attachment section */}
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Document Attachment</Label>
                    {!module.documentUrl && !isLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-gray-500 hover:bg-black hover:text-white transition-colors flex items-center gap-1"
                        onClick={triggerFileInput}
                      >
                        <Paperclip size={16} />
                        <span>Attach</span>
                      </Button>
                    )}
                  </div>
                  
                  {module.documentUrl ? (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md mt-2">
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
                                className="h-8 w-8 rounded-full hover:bg-black hover:text-white transition-colors"
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
                                className="h-8 w-8 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
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
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange} 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    />
                  )}
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
