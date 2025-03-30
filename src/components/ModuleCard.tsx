
import React, { useState, useRef, useEffect } from "react";
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
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  autoFocus?: boolean;
}

const ModuleCard = ({
  module,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  isLocked,
  currencySymbol,
  onEdit,
  isExpanded,
  setIsExpanded,
  autoFocus
}: ModuleCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [autoFocus]);

  const handleChange = (field: keyof Module, value: any) => {
    const updatedModule = { ...module, [field]: value };
    onUpdate(module.id, updatedModule);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDocumentUpdate = (documentUrl?: string, documentName?: string) => {
    const updatedModule = { 
      ...module, 
      documentUrl, 
      documentName 
    };
    onUpdate(module.id, updatedModule);
  };

  const displayedCost = module.costType === 'variable' && module.costQuantity 
    ? module.cost * module.costQuantity 
    : module.cost;

  const getCardClasses = () => {
    let leftBorder = "";
    
    if (module.stakeholder === 'internal') {
      leftBorder = "border-l-4 border-l-blue-500";
    } else if (module.stakeholder === 'external') {
      leftBorder = "border-l-4 border-l-purple-500";
    }
    
    const rightBorder = module.nonNegotiable 
      ? "border-r-8 border-r-red-500" 
      : "border-r-8 border-r-gray-300";
    
    return `border border-gray-200 shadow-sm transition-all ${leftBorder} ${rightBorder}`;
  };

  return (
    <Draggable draggableId={module.id} index={index} isDragDisabled={isLocked}>
      {(provided) => (
        <Card
          ref={(el) => {
            provided.innerRef(el);
            // @ts-ignore - combining refs
            cardRef.current = el;
          }}
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
              expanded={isExpanded}
              toggleExpanded={toggleExpanded}
              isLocked={isLocked}
              displayedCost={displayedCost}
              currencySymbol={currencySymbol}
            />
            
            {isExpanded && (
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
