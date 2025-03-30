
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";

interface ModuleActionsProps {
  onAddModule: () => void;
  onGoToPricing: () => void;
}

const ModuleActions = ({ onAddModule, onGoToPricing }: ModuleActionsProps) => {
  return (
    <div className="flex justify-center mt-6">
      <Button 
        className="bg-black hover:bg-black/80 transition-colors flex items-center gap-1 mr-4"
        onClick={onAddModule}
      >
        <Plus size={16} />
        <span>Add Module</span>
      </Button>
      
      <Button 
        className="bg-black hover:bg-black/80 transition-colors flex items-center gap-1"
        onClick={onGoToPricing}
      >
        <ArrowRight size={16} />
        <span>Go to Pricing</span>
      </Button>
    </div>
  );
};

export default ModuleActions;
