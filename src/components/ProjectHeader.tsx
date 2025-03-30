
import { Button } from "@/components/ui/button";
import { Menu, Save } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useProject } from "@/context/ProjectContext";
import ProjectBanner from "./ProjectBanner";

const ProjectHeader = ({ onEditClick }: { onEditClick: () => void }) => {
  const { toggleSidebar } = useSidebar();
  const { currentStack, saveStack } = useProject();

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-100">
      <div className="px-6 md:px-8 py-5 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-6 top-5 lg:hidden text-apple-neutral hover:bg-gray-100 hover:text-apple-primary" 
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </Button>
        
        <div className="flex-1">
          <ProjectBanner
            title={currentStack.name}
            description={currentStack.description}
            owner={currentStack.owner}
            onEditClick={onEditClick}
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={saveStack}
          className="flex items-center gap-1 border-gray-200 hover:bg-black hover:text-white transition-colors"
        >
          <Save size={16} />
          Save Progress
        </Button>
      </div>
    </header>
  );
};

export default ProjectHeader;
