
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
import { Copy, Trash, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export interface ModuleCardProps {
  module: Module;
  index: number;
  onUpdate: (moduleId: string, updatedModule: Module) => void;
  onDelete: (moduleId: string) => void;
  onDuplicate: (moduleId: string) => void;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (field: keyof Module, value: any) => {
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

  return (
    <Draggable draggableId={module.id} index={index} isDragDisabled={isLocked}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="border-gray-200 bg-white"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center gap-2">
              <div
                {...provided.dragHandleProps}
                className="cursor-grab text-gray-400 hover:text-gray-600"
              >
                <GripVertical size={20} />
              </div>

              <Input
                value={module.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Module name"
                className="flex-1"
                disabled={isLocked}
              />
              
              <div className="flex items-center gap-1">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${getStakeholderBadgeColor()} px-2 h-8`}
                      disabled={isLocked}
                    >
                      {module.stakeholderName || module.stakeholder}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Stakeholder Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="stakeholderName">Stakeholder Name</Label>
                        <Input
                          id="stakeholderName"
                          value={module.stakeholderName || ""}
                          onChange={(e) => handleChange("stakeholderName", e.target.value)}
                          placeholder="Enter stakeholder name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stakeholderType">Stakeholder Type</Label>
                        <Select
                          value={module.stakeholder}
                          onValueChange={(value) => handleChange("stakeholder", value)}
                        >
                          <SelectTrigger id="stakeholderType">
                            <SelectValue placeholder="Select stakeholder type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 px-2 text-xs"
                  disabled={isLocked}
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor={`value-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Value Delivered
                  </label>
                  <Textarea
                    id={`value-${module.id}`}
                    value={module.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    placeholder="Describe the value this module delivers..."
                    className="resize-none h-20"
                    disabled={isLocked}
                  />
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

                <div className="flex items-center justify-between">
                  <div className="flex-grow space-y-2">
                    <label htmlFor={`time-${module.id}`} className="block text-sm font-medium text-gray-700">
                      Time Impact: {module.timeImpact}
                    </label>
                    <div className="flex gap-2 items-center">
                      <Slider
                        id={`time-${module.id}`}
                        value={[module.timeImpact]}
                        min={1}
                        max={40}
                        step={1}
                        onValueChange={(values) => handleChange("timeImpact", values[0])}
                        disabled={isLocked}
                        className="flex-grow"
                      />
                      <Select
                        value={module.timeUnit || "days"}
                        onValueChange={(value: "days" | "weeks" | "months") => handleChange("timeUnit", value)}
                        disabled={isLocked}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
