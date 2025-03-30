
import React, { useState } from "react";
import { Module } from "@/types/stack";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import ModuleHeader from "./modules/card/ModuleHeader";
import ModuleDetails from "./modules/card/ModuleDetails";
import CostInputs from "./modules/card/CostInputs";
import DocumentAttachment from "./modules/card/DocumentAttachment";

interface ModuleCardProps {
  module: Module;
  index: number;
  onUpdate: (id: string, module: Module) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isLocked: boolean;
  currencySymbol: string;
  onEdit?: () => void;
}

const ModuleCard = ({
  module,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  isLocked,
  currencySymbol,
  onEdit
}: ModuleCardProps) => {
  // Start with module expanded by default
  const [expanded, setExpanded] = useState(true);

  const handleChange = (field: keyof Module, value: any) => {
    const updatedModule = { ...module, [field]: value };
    onUpdate(module.id, updatedModule);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleDocumentUpdate = (documentUrl?: string, documentName?: string) => {
    const updatedModule = { 
      ...module, 
      documentUrl, 
      documentName 
    };
    onUpdate(module.id, updatedModule);
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
    
    // Add red border only for the right side of non-negotiable modules
    const nonNegotiableBorder = module.nonNegotiable 
      ? "border-r-4 border-red-500" 
      : "";
    
    return `border border-gray-200 shadow-sm transition-all ${borderColor} ${nonNegotiableBorder}`;
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
            <ModuleHeader 
              module={module}
              onUpdate={handleChange}
              onDelete={() => onDelete(module.id)}
              onDuplicate={() => onDuplicate(module.id)}
              expanded={expanded}
              toggleExpanded={toggleExpanded}
              isLocked={isLocked}
              displayedCost={displayedCost}
              currencySymbol={currencySymbol}
            />
            
            {expanded && (
              <>
                <ModuleDetails 
                  module={module}
                  onUpdate={handleChange}
                  isLocked={isLocked}
                />
                
                <CostInputs 
                  module={module}
                  onUpdate={handleChange}
                  isLocked={isLocked}
                  currencySymbol={currencySymbol}
                />
                
                <DocumentAttachment 
                  documentUrl={module.documentUrl}
                  documentName={module.documentName}
                  onUpdate={handleDocumentUpdate}
                  isLocked={isLocked}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default ModuleCard;
