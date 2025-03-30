
import { useState } from "react";
import { Card } from "@/components/ui/card";
import StackBuilder from "@/components/StackBuilder";
import Summary from "@/components/Summary";
import ProjectCreation from "@/components/ProjectCreation";
import EditProjectDialog from "@/components/EditProjectDialog";
import { useProject } from "@/context/ProjectContext";
import ProjectHeader from "@/components/ProjectHeader";

const Index = () => {
  const [currentTab, setCurrentTab] = useState<"builder" | "summary">("builder");
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  
  const { 
    currentStack, 
    setStack, 
    saveStack, 
    handleUpdateProject,
    handleProjectCreate,
    currencySymbol
  } = useProject();

  return (
    <div className="min-h-screen">
      {currentStack.isInitialized ? (
        <>
          <ProjectHeader 
            onEditClick={() => setEditProjectDialogOpen(true)} 
          />

          <main className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className={currentTab === "builder" ? "block" : "hidden"}>
              <Card className="apple-card">
                <StackBuilder 
                  stack={currentStack} 
                  setStack={setStack} 
                  onSave={saveStack}
                  onViewSummary={() => setCurrentTab("summary")} 
                  currencySymbol={currencySymbol}
                />
              </Card>
            </div>
            
            <div className={currentTab === "summary" ? "block" : "hidden"}>
              <Card className="apple-card">
                <Summary 
                  stack={currentStack} 
                  onBack={() => setCurrentTab("builder")} 
                  currencySymbol={currencySymbol} 
                />
              </Card>
            </div>
          </main>
          
          <EditProjectDialog 
            open={editProjectDialogOpen} 
            onClose={() => setEditProjectDialogOpen(false)}
            onSave={handleUpdateProject}
            projectName={currentStack.name}
            projectDescription={currentStack.description || ""}
            projectOwner={currentStack.owner || ""}
          />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <ProjectCreation onProjectCreate={handleProjectCreate} />
        </div>
      )}
    </div>
  );
};

export default Index;
