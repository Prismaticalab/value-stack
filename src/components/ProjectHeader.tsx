
import { Button } from "@/components/ui/button";
import { Menu, Save, Edit } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useProject } from "@/context/ProjectContext";

const ProjectHeader = ({ onEditClick }: { onEditClick: () => void }) => {
  const { toggleSidebar } = useSidebar();
  const { currentStack, saveStack } = useProject();

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-100">
      <div className="px-6 md:px-8 py-5 flex justify-between items-center">
        <div className="flex flex-col">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-6 top-5 lg:hidden text-apple-neutral hover:bg-gray-100 hover:text-apple-primary" 
            onClick={toggleSidebar}
          >
            <Menu size={22} />
          </Button>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-apple-neutral tracking-tight">{currentStack.name}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={onEditClick}
            >
              <Edit size={16} />
            </Button>
          </div>
          {currentStack.description && (
            <p className="text-sm text-gray-500 mt-1 border-b border-gray-100 pb-1">{currentStack.description}</p>
          )}
          {currentStack.owner && (
            <p className="text-sm text-gray-500 mt-1 border-b border-gray-100 pb-1">Owner: <span className="font-semibold">{currentStack.owner}</span></p>
          )}
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            onClick={saveStack}
            className="flex items-center gap-1 border-gray-200 hover:bg-black hover:text-white transition-colors"
          >
            <Save size={16} />
            Save Progress
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;
