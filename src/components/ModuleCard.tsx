
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Module } from "@/types/stack";
import { Copy, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";

interface ModuleCardProps {
  module: Module;
  index: number;
  onUpdate: (moduleId: string, module: Module) => void;
  onDelete: (moduleId: string) => void;
  onDuplicate: (moduleId: string) => void;
  isLocked: boolean;
}

const ModuleCard = ({ 
  module, 
  index, 
  onUpdate, 
  onDelete,
  onDuplicate,
  isLocked
}: ModuleCardProps) => {
  const [expanded, setExpanded] = useState(true);
  
  const handleChange = (field: string, value: string | number) => {
    onUpdate(module.id, { ...module, [field]: value });
  };

  return (
    <Draggable draggableId={module.id} index={index} isDragDisabled={isLocked}>
      {(provided) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`border p-4 relative transition-all ${
            expanded ? "shadow-sm" : ""
          } ${isLocked ? "bg-gray-50" : ""}`}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                {...provided.dragHandleProps} 
                className="cursor-grab p-1 hover:bg-gray-100 rounded"
              >
                <div className="h-4 w-4 flex flex-col justify-between opacity-60">
                  <div className="h-0.5 w-full bg-current rounded-full"></div>
                  <div className="h-0.5 w-full bg-current rounded-full"></div>
                  <div className="h-0.5 w-full bg-current rounded-full"></div>
                </div>
              </div>
              <h3 className="font-medium">
                {module.name || "Unnamed Module"}
              </h3>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(module.id)}
                disabled={isLocked}
                className="h-8 w-8 p-0"
              >
                <Copy size={16} />
                <span className="sr-only">Duplicate</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(module.id)}
                disabled={isLocked}
                className="h-8 w-8 p-0 hover:text-red-500"
              >
                <Trash size={16} />
                <span className="sr-only">Delete</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="h-8 w-8 p-0"
              >
                {expanded ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="sr-only">{expanded ? "Collapse" : "Expand"}</span>
              </Button>
            </div>
          </div>
          
          {expanded && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`module-name-${module.id}`} className="text-sm">
                    Action/Task
                  </Label>
                  <Input
                    id={`module-name-${module.id}`}
                    value={module.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter task name"
                    readOnly={isLocked}
                    className="border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`module-stakeholder-${module.id}`} className="text-sm">
                    Responsible Stakeholder
                  </Label>
                  <Select
                    value={module.stakeholder}
                    onValueChange={(value: "internal" | "external") => handleChange("stakeholder", value)}
                    disabled={isLocked}
                  >
                    <SelectTrigger id={`module-stakeholder-${module.id}`} className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`module-value-${module.id}`} className="text-sm">
                    Value Delivered
                  </Label>
                  <Textarea
                    id={`module-value-${module.id}`}
                    value={module.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    placeholder="Describe the value delivered"
                    readOnly={isLocked}
                    className="border-gray-200 h-20 resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`module-cost-${module.id}`} className="text-sm">
                    Cost ($)
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id={`module-cost-${module.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={module.cost}
                      onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
                      className="pl-7 border-gray-200"
                      readOnly={isLocked}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`module-time-${module.id}`} className="text-sm">
                      Time Impact (hours)
                    </Label>
                    <span className="text-sm font-medium">{module.timeImpact} hrs</span>
                  </div>
                  <Slider
                    id={`module-time-${module.id}`}
                    min={0.5}
                    max={40}
                    step={0.5}
                    value={[module.timeImpact]}
                    onValueChange={(val) => handleChange("timeImpact", val[0])}
                    disabled={isLocked}
                    className="my-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`module-delivery-${module.id}`} className="text-sm">
                      Delivery Impact (1-10)
                    </Label>
                    <span className="text-sm font-medium">{module.deliveryImpact}</span>
                  </div>
                  <Slider
                    id={`module-delivery-${module.id}`}
                    min={1}
                    max={10}
                    step={1}
                    value={[module.deliveryImpact]}
                    onValueChange={(val) => handleChange("deliveryImpact", val[0])}
                    disabled={isLocked}
                    className="my-4"
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </Draggable>
  );
};

export default ModuleCard;
