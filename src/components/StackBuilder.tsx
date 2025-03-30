
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ModuleCard from "./ModuleCard";
import ValueCaptureForm from "./ValueCaptureForm";
import { Stack, Module } from "@/types/stack";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Plus, Save, FileText, ArrowRight, ArrowLeft, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ModuleEditDialog from "./ModuleEditDialog";

interface StackBuilderProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onSave: () => void;
  onViewSummary: () => void;
  currencySymbol: string;
}

const StackBuilder = ({ stack, setStack, onSave, onViewSummary, currencySymbol }: StackBuilderProps) => {
  const [valueCaptureView, setValueCaptureView] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    calculateTotals();
  }, [stack.modules, stack.agencyFees, stack.referralCosts, stack.marketingExpenses, stack.desiredMargin]);

  const calculateTotals = () => {
    const totalDeliveryCost = stack.modules.reduce((sum, module) => {
      if (module.costType === "variable" && module.cost && module.costQuantity) {
        return sum + (module.cost * module.costQuantity);
      }
      return sum + module.cost;
    }, 0);
    
    setStack({
      ...stack,
      totalCost: totalDeliveryCost,
    });
  };

  const addNewModule = () => {
    const newModule: Module = {
      id: crypto.randomUUID(),
      name: "",
      value: "",
      stakeholder: "internal",
      stakeholderName: "",
      costType: "fixed", 
      cost: 0,
      costUnit: "",
      costQuantity: 1,
      timeImpact: 1,
      timeUnit: "days",
      nonNegotiable: false
    };

    setStack({
      ...stack,
      modules: [...stack.modules, newModule]
    });
  };

  const updateModule = (moduleId: string, updatedModule: Module) => {
    setStack({
      ...stack,
      modules: stack.modules.map(mod => 
        mod.id === moduleId ? updatedModule : mod
      )
    });
  };

  const deleteModule = (moduleId: string) => {
    const moduleToDelete = stack.modules.find(mod => mod.id === moduleId);
    
    if (moduleToDelete && moduleToDelete.nonNegotiable) {
      toast({
        title: "Cannot Delete Non-Negotiable Module",
        description: "This module is marked as non-negotiable and cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    setStack({
      ...stack,
      modules: stack.modules.filter(mod => mod.id !== moduleId)
    });
  };

  const duplicateModule = (moduleId: string) => {
    const moduleToDuplicate = stack.modules.find(mod => mod.id === moduleId);
    if (!moduleToDuplicate) return;

    const duplicatedModule = {
      ...moduleToDuplicate,
      id: crypto.randomUUID()
    };

    setStack({
      ...stack,
      modules: [...stack.modules, duplicatedModule]
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(stack.modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStack({
      ...stack,
      modules: items
    });
  };

  const goToPricing = () => {
    setValueCaptureView(true);
    toast({
      title: "Ready to set pricing",
      description: "Now you can set your pricing details."
    });
  };
  
  const openModuleEditor = (moduleId: string) => {
    setEditingModuleId(moduleId);
  };

  const getModuleById = (moduleId: string) => {
    return stack.modules.find(mod => mod.id === moduleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-medium">Stack Builder</h2>
          {stack.description && (
            <p className="text-sm text-gray-500 mt-1">{stack.description}</p>
          )}
        </div>
        <div className="flex gap-2 self-end">
          <Button 
            variant="outline" 
            onClick={onSave}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            Save Progress
          </Button>
          
          {stack.modules.length > 0 && (
            <Button 
              onClick={onViewSummary}
              className="bg-black hover:bg-black/80 flex items-center gap-1"
            >
              <FileText size={16} />
              Summary
            </Button>
          )}
        </div>
      </div>

      {!valueCaptureView ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Modules</h2>
          </div>

          {stack.modules.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
              <p className="text-gray-500 mb-4">No modules added yet</p>
              <Button 
                onClick={addNewModule}
                className="bg-black hover:bg-black/80"
              >
                Add Your First Module
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="modules">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {stack.modules.map((module, index) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        index={index}
                        onUpdate={updateModule}
                        onDelete={deleteModule}
                        onDuplicate={duplicateModule}
                        isLocked={stack.locked}
                        currencySymbol={currencySymbol}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          
          {stack.modules.length > 0 && (
            <div className="flex justify-center mt-6">
              <Button 
                className="bg-black hover:bg-black/80 flex items-center gap-1 mr-4"
                onClick={addNewModule}
              >
                <Plus size={16} />
                Add Module
              </Button>
              
              <Button 
                className="bg-black hover:bg-black/80 flex items-center gap-1"
                onClick={goToPricing}
              >
                <ArrowRight size={16} />
                Go to Pricing
              </Button>
            </div>
          )}
          
          {stack.modules.length > 0 && (
            <div className="pt-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Total Delivery Cost:</span>
                <span>{currencySymbol}{stack.totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setValueCaptureView(false)}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to Builder
            </Button>
            <h2 className="text-xl font-medium">Pricing Analysis</h2>
          </div>
          
          {/* Show modules in collapsed view */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-medium mb-3">Modules</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {stack.modules.map((module) => (
                <div key={module.id} className="flex justify-between items-center p-2 bg-white rounded border">
                  <div className="flex items-center">
                    {module.nonNegotiable && <Star size={14} className="text-yellow-500 mr-2" fill="currentColor" />}
                    <div className={`w-2 h-2 rounded-full mr-2 ${module.stakeholder === 'internal' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                    <span className="font-medium">{module.name || "Unnamed Module"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-4">{currencySymbol}{module.costType === 'variable' && module.costQuantity ? (module.cost * module.costQuantity).toFixed(2) : module.cost.toFixed(2)}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openModuleEditor(module.id)}
                      className="text-xs h-8"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <ValueCaptureForm 
            stack={stack} 
            setStack={setStack}
            currencySymbol={currencySymbol}
          />
        </div>
      )}
      
      {/* Module Edit Dialog */}
      {editingModuleId && (
        <ModuleEditDialog
          module={getModuleById(editingModuleId)!}
          onSave={(updatedModule) => {
            updateModule(editingModuleId, updatedModule);
            setEditingModuleId(null);
          }}
          onCancel={() => setEditingModuleId(null)}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};

export default StackBuilder;
