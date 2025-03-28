
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

  const handleChange = (field: keyof Module, value: any) => {
    const updatedModule = { ...module, [field]: value };
    onUpdate(module.id, updatedModule);
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`stakeholder-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Responsible Stakeholder
                    </label>
                    <Select
                      value={module.stakeholder}
                      onValueChange={(value) => handleChange("stakeholder", value)}
                      disabled={isLocked}
                    >
                      <SelectTrigger id={`stakeholder-${module.id}`}>
                        <SelectValue placeholder="Select stakeholder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor={`cost-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Cost ({currencySymbol})
                    </label>
                    <Input
                      id={`cost-${module.id}`}
                      type="number"
                      value={module.cost}
                      onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      disabled={isLocked}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`time-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Time Impact: {module.timeImpact} hrs
                  </label>
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

                <div>
                  <label htmlFor={`impact-${module.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Impact: {module.deliveryImpact}/10
                  </label>
                  <Slider
                    id={`impact-${module.id}`}
                    value={[module.deliveryImpact]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(values) => handleChange("deliveryImpact", values[0])}
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
