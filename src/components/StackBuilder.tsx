
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ModuleCard from "./ModuleCard";
import ValueCaptureForm from "./ValueCaptureForm";
import { Stack, Module } from "@/types/stack";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Plus, Save, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StackBuilderProps {
  stack: Stack;
  setStack: (stack: Stack) => void;
  onSave: () => void;
  onViewSummary: () => void;
  currencySymbol: string;
}

const StackBuilder = ({ stack, setStack, onSave, onViewSummary, currencySymbol }: StackBuilderProps) => {
  const [valueCaptureView, setValueCaptureView] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    calculateTotals();
  }, [stack.modules, stack.agencyFees, stack.referralCosts, stack.marketingExpenses, stack.desiredMargin]);

  const calculateTotals = () => {
    // Calculate total module costs, accounting for variable costs
    const totalDeliveryCost = stack.modules.reduce((sum, module) => {
      if (module.costType === "variable" && module.cost && module.costQuantity) {
        return sum + (module.cost * module.costQuantity);
      }
      return sum + module.cost;
    }, 0);
    
    const totalCost = totalDeliveryCost + stack.agencyFees + stack.referralCosts + stack.marketingExpenses;
    
    const marginMultiplier = 1 + (stack.desiredMargin / 100);
    const finalPrice = totalCost * marginMultiplier;
    
    const netProfit = finalPrice - totalCost;
    const marginPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    
    setStack({
      ...stack,
      totalCost,
      finalPrice,
      netProfit,
      marginPercent
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
      deliveryImpact: 5
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

  const toggleLock = () => {
    setStack({
      ...stack,
      locked: !stack.locked
    });

    if (!stack.locked) {
      setValueCaptureView(true);
      toast({
        title: "Stack locked",
        description: "Now you can set pricing and margins."
      });
    } else {
      setValueCaptureView(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="stackName" className="text-sm font-medium mb-2 block">Stack Name</Label>
          <Input
            id="stackName"
            value={stack.name}
            onChange={(e) => setStack({ ...stack, name: e.target.value })}
            className="border-gray-200 focus:border-[#9B87F5] focus:ring-[#9B87F5]"
          />
        </div>
        <div className="flex gap-2 self-end">
          <Button 
            variant="outline" 
            onClick={onSave}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            Save
          </Button>
          
          <Button 
            variant="outline"
            onClick={toggleLock}
            className={stack.locked ? "bg-gray-100" : ""}
          >
            {stack.locked ? "Unlock Stack" : "Lock Stack"}
          </Button>
          
          {stack.modules.length > 0 && (
            <Button 
              onClick={onViewSummary}
              className="bg-[#9B87F5] hover:bg-[#8A76E4] flex items-center gap-1"
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
            <Button 
              onClick={addNewModule}
              className="bg-[#9B87F5] hover:bg-[#8A76E4] flex items-center gap-1"
              disabled={stack.locked}
            >
              <Plus size={16} />
              Add Module
            </Button>
          </div>

          {stack.modules.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
              <p className="text-gray-500 mb-4">No modules added yet</p>
              <Button 
                onClick={addNewModule}
                className="bg-[#9B87F5] hover:bg-[#8A76E4]"
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
            <div className="pt-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Total Delivery Cost:</span>
                <span>{currencySymbol}{stack.totalCost.toFixed(2)}</span>
              </div>
              
              {stack.modules.length > 1 && !stack.locked && (
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={toggleLock}
                    className="bg-[#9B87F5] hover:bg-[#8A76E4]"
                  >
                    Complete & Set Pricing
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <ValueCaptureForm 
          stack={stack} 
          setStack={setStack}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};

export default StackBuilder;
