
import { Button } from "@/components/ui/button";

interface EmptyModuleStateProps {
  onAddModule: () => void;
}

const EmptyModuleState = ({ onAddModule }: EmptyModuleStateProps) => {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
      <p className="text-gray-500 mb-4">No modules added yet</p>
      <Button 
        onClick={onAddModule}
        className="bg-black hover:bg-black/80 transition-colors"
      >
        Add Your First Module
      </Button>
    </div>
  );
};

export default EmptyModuleState;
