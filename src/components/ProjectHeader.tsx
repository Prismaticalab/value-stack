
import { Button } from "@/components/ui/button";
import { Menu, Save, Edit } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useProject } from "@/context/ProjectContext";

interface ProjectHeaderProps {
  onEditClick: () => void;
}

const ProjectHeader = ({ onEditClick }: ProjectHeaderProps) => {
  const { toggleSidebar } = useSidebar();
  const { currentStack, saveStack } = useProject();

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-100">
      <div className="px-6 md:px-8 py-5 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 lg:hidden text-apple-neutral hover:bg-gray-100 hover:text-apple-primary" 
            onClick={toggleSidebar}
          >
            <Menu size={22} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-apple-neutral tracking-tight">{currentStack.name}</h1>
            {currentStack.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{currentStack.description}</p>
            )}
            {currentStack.owner && (
              <p className="text-xs text-gray-500 mt-0.5">Owner: {currentStack.owner}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            onClick={onEditClick}
            className="flex items-center gap-1 border-gray-200 hover:bg-black hover:text-white transition-colors"
          >
            <Edit size={16} />
            Edit Project
          </Button>
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
