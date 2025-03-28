
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Module } from "@/types/stack";
import { Draggable } from "react-beautiful-dnd";
import { Copy, Trash, GripVertical, AlertCircle, Check, Clock, Plus, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface ModuleCardProps {
  module: Module;
  index: number;
  onUpdate: (moduleId: string, updatedModule: Module) => void;
  onDelete: (moduleId: string) => void;
  onDuplicate: (moduleId: string) => void;
  isLocked: boolean;
  currencySymbol: string;
  onGoToPricing?: () => void;
  onAddNewModule?: () => void;
}

const ModuleCard = ({
  module,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  isLocked,
  currencySymbol,
  onGoToPricing,
  onAddNewModule
}: ModuleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const { toast } = useToast();

  const validateModule = (): boolean => {
    const newErrors: Record<string, string> = {};
    const missing: string[] = [];

    if (!module.name) {
      newErrors.name = "Module name is required";
      missing.push("Module Name");
    }
    
    if (!module.value) {
      newErrors.value = "Value description is required";
      missing.push("Value Delivered");
    }

    if (!module.stakeholderName) {
      newErrors.stakeholderName = "Stakeholder name is required";
      missing.push("Stakeholder Name");
    }

    if (!module.stakeholder) {
      newErrors.stakeholder = "Stakeholder type is required";
      missing.push("Stakeholder Type");
    }

    setErrors(newErrors);
    setMissingFields(missing);

    return Object.keys(newErrors).length === 0;
  };

  const validateField = (field: string, value: any): string => {
    if (field === "name" && !value) {
      return "Module name is required";
    }
    if (field === "value" && !value) {
      return "Value description is required";
    }
    if (field === "stakeholderName" && !value) {
      return "Stakeholder name is required";
    }
    if (field === "stakeholder" && !value) {
      return "Stakeholder type is required";
    }
    return "";
  };

  const handleChange = (field: keyof Module, value: any) => {
    // Validate the field
    const errorMessage = validateField(field, value);
    
    // Update errors state
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    const updatedModule = { ...module, [field]: value };
    
    // Special handling for costType changes
    if (field === "costType") {
      if (value === "variable" && !updatedModule.costUnit) {
        updatedModule.costUnit = "hours";
        updatedModule.costQuantity = 1;
      }
    }
    
    // Update total cost calculation when cost type, unit cost or quantity changes
    if (field === "cost" || field === "costQuantity") {
      if (module.costType === "variable") {
        const totalCost = updatedModule.cost * updatedModule.costQuantity;
        // We don't actually update the cost field directly, since we want to preserve the unit cost
      }
    }
    
    onUpdate(module.id, updatedModule);
  };

  const calculateTotalCost = () => {
    if (module.costType === "variable" && module.cost && module.costQuantity) {
      return module.cost * module.costQuantity;
    }
    return module.cost;
  };

  const getStakeholderBadgeColor = () => {
    return module.stakeholder === "internal" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800";
  };

  const handleSaveModule = () => {
    if (validateModule()) {
      setSaved(true);
      setIsExpanded(false);
      toast({
        title: "Module saved",
        description: "Module has been added to your stack."
      });
    } else {
      setShowValidationAlert(true);
    }
  };

  return (
    <Draggable draggableId={module.id} index={index} isDragDisabled={isLocked || saved}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`border-gray-200 bg-white ${saved ? 'border-l-4 border-l-green-500' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center gap-2">
              <div
                {...provided.dragHandleProps}
                className="cursor-grab text-gray-400 hover:text-gray-600"
              >
                <GripVertical size={20} />
              </div>

              <div className="flex-1">
                <Input
                  value={module.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Module name (required)"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isLocked || saved}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {!saved && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(module.id)}
                      className="h-8 w-8 p-0"
                      disabled={isLocked}
                    >
                      <Copy size={16} />
                      <span className="sr-only">Duplicate</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(module.id)}
                      className="h-8 w-8 p-0 hover:text-red-500"
                      disabled={isLocked}
                    >
                      <Trash size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </>
                )}
                {!saved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 px-2 text-xs"
                    disabled={isLocked}
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </Button>
                )}
                {saved && (
                  <div className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <span className="text-xs font-medium">Saved</span>
                  </div>
                )}
              </div>
            </div>

            {isExpanded && !saved && (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor={`value-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Value Delivered <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id={`value-${module.id}`}
                    value={module.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    placeholder="Describe the value this module delivers... (required)"
                    className={`resize-none h-20 ${errors.value ? "border-red-500" : ""}`}
                    disabled={isLocked}
                  />
                  {errors.value && (
                    <p className="text-xs text-red-500 mt-1">{errors.value}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor={`stakeholder-name-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Stakeholder Name <span className="text-red-500 mx-1">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle size={14} className="text-gray-400 cursor-help ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Enter the name of the person or organization responsible for this module</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Input
                      id={`stakeholder-name-${module.id}`}
                      value={module.stakeholderName || ""}
                      onChange={(e) => handleChange("stakeholderName", e.target.value)}
                      placeholder="Enter stakeholder name (required)"
                      className={errors.stakeholderName ? "border-red-500" : ""}
                      disabled={isLocked}
                    />
                    {errors.stakeholderName && (
                      <p className="text-xs text-red-500 mt-1">{errors.stakeholderName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`stakeholder-type-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Stakeholder Type <span className="text-red-500 mx-1">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle size={14} className="text-gray-400 cursor-help ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Internal: Your team or organization. External: Client, vendor, or third party.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select
                      value={module.stakeholder}
                      onValueChange={(value: "internal" | "external") => handleChange("stakeholder", value)}
                      disabled={isLocked}
                    >
                      <SelectTrigger id={`stakeholder-type-${module.id}`} className={!module.stakeholder ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select stakeholder type (required)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                      </SelectContent>
                    </Select>
                    {!module.stakeholder && (
                      <p className="text-xs text-red-500 mt-1">Stakeholder type is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Type
                  </label>
                  <Select
                    value={module.costType || "fixed"}
                    onValueChange={(value) => handleChange("costType", value)}
                    disabled={isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cost type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Cost</SelectItem>
                      <SelectItem value="variable">Variable Cost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {module.costType === "fixed" ? (
                  <div>
                    <label htmlFor={`cost-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Cost ({currencySymbol})
                    </label>
                    <Input
                      id={`cost-${module.id}`}
                      type="number"
                      value={module.cost || ""}
                      onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      disabled={isLocked}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label htmlFor={`cost-unit-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Unit
                        </label>
                        <Input
                          id={`cost-unit-${module.id}`}
                          type="text"
                          value={module.costUnit || ""}
                          onChange={(e) => handleChange("costUnit", e.target.value)}
                          placeholder="hours"
                          disabled={isLocked}
                        />
                      </div>
                      <div className="col-span-1">
                        <label htmlFor={`cost-per-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Cost per unit
                        </label>
                        <Input
                          id={`cost-per-${module.id}`}
                          type="number"
                          value={module.cost || ""}
                          onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          disabled={isLocked}
                        />
                      </div>
                      <div className="col-span-1">
                        <label htmlFor={`quantity-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <Input
                          id={`quantity-${module.id}`}
                          type="number"
                          value={module.costQuantity || ""}
                          onChange={(e) => handleChange("costQuantity", parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          disabled={isLocked}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      Total: {currencySymbol}{calculateTotalCost().toFixed(2)}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Time Impact
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle size={14} className="text-gray-400 cursor-help ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Estimated time needed to complete this module</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-grow">
                        <Slider
                          id={`time-${module.id}`}
                          value={[module.timeImpact]}
                          min={1}
                          max={40}
                          step={1}
                          onValueChange={(values) => handleChange("timeImpact", values[0])}
                          disabled={isLocked}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-10 text-right">
                        {module.timeImpact}
                      </span>
                    </div>
                    <Select
                      value={module.timeUnit || "days"}
                      onValueChange={(value: "days" | "weeks" | "months") => handleChange("timeUnit", value)}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full bg-[#9B87F5] hover:bg-[#8A76E4]"
                    onClick={handleSaveModule}
                  >
                    Save Module to Stack
                  </Button>
                </div>
              </div>
            )}

            {saved && (
              <div className="mt-4 space-y-3">
                {module.stakeholderName && (
                  <div className="text-sm">
                    <span className="font-medium">Stakeholder:</span> {module.stakeholderName}{' '}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStakeholderBadgeColor()}`}>
                      {module.stakeholder === "internal" ? "Internal" : "External"}
                    </span>
                  </div>
                )}
                
                {module.costType && (
                  <div className="text-sm">
                    <span className="font-medium">Cost:</span> {currencySymbol}{calculateTotalCost().toFixed(2)}
                  </div>
                )}

                {module.timeImpact && (
                  <div className="text-sm">
                    <span className="font-medium">Time:</span> {module.timeImpact} {module.timeUnit}
                  </div>
                )}

                <div className="flex space-x-3 pt-3">
                  {onAddNewModule && (
                    <Button 
                      variant="outline"
                      onClick={onAddNewModule}
                      className="flex-1"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Module
                    </Button>
                  )}
                  
                  {onGoToPricing && (
                    <Button 
                      className="flex-1 bg-[#9B87F5] hover:bg-[#8A76E4]"
                      onClick={onGoToPricing}
                    >
                      <ArrowRight size={16} className="mr-1" />
                      Go to Pricing
                    </Button>
                  )}
                </div>
              </div>
            )}

            <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Incomplete Module</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please fill in all required fields before saving:
                    <ul className="list-disc pl-5 mt-2">
                      {missingFields.map((field, index) => (
                        <li key={index} className="text-red-500">{field}</li>
                      ))}
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Okay</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default ModuleCard;
