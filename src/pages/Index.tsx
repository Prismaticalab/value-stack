
import { useState } from "react";
import { Card } from "@/components/ui/card";
import StackBuilder from "@/components/StackBuilder";
import Summary from "@/components/Summary";
import ProjectCreation from "@/components/ProjectCreation";
import EditProjectDialog from "@/components/EditProjectDialog";
import { useProject } from "@/context/ProjectContext";
import ProjectHeader from "@/components/ProjectHeader";
import ProcessSteps from "@/components/ProcessSteps";

const Index = () => {
  const [currentTab, setCurrentTab] = useState<"builder" | "pricing" | "summary">("builder");
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  
  const { 
    currentStack, 
    setStack, 
    saveStack, 
    handleUpdateProject,
    handleProjectCreate,
    currencySymbol
  } = useProject();

  // Get current step based on the active tab
  const getCurrentStep = () => {
    if (!currentStack.isInitialized) return 1;
    if (currentTab === "builder") return 2;
    if (currentTab === "pricing") return 3;
    return 4; // summary
  };

  return (
    <div className="min-h-screen">
      {currentStack.isInitialized ? (
        <>
          <ProjectHeader 
            onEditClick={() => setEditProjectDialogOpen(true)} 
          />

          <main className="p-6 md:p-8 pt-2 max-w-7xl mx-auto">
            <ProcessSteps 
              currentStep={getCurrentStep()} 
              steps={[
                "Create Project", 
                "Value Delivery Stack", 
                "Costing Review & Pricing", 
                "Final Summary"
              ]} 
            />

            {currentTab === "builder" && (
              <>
                <div className="my-6 text-center max-w-2xl mx-auto">
                  <h2 className="text-xl font-medium text-gray-700">Let's build your value delivery stack!</h2>
                  <p className="text-sm text-gray-500 mt-2">Add modules that represent the components of your service offering.</p>
                </div>
                
                <Card className="apple-card">
                  <StackBuilder 
                    stack={currentStack} 
                    setStack={setStack} 
                    onSave={saveStack}
                    onViewPricing={() => setCurrentTab("pricing")} 
                    currencySymbol={currencySymbol}
                  />
                </Card>
              </>
            )}
            
            {currentTab === "pricing" && (
              <>
                <div className="my-6 text-center max-w-2xl mx-auto">
                  <h2 className="text-xl font-medium text-gray-700">Let's take a final look and finalise the details!</h2>
                  <p className="text-sm text-gray-500 mt-2">Review costs and determine your final pricing strategy.</p>
                </div>
                
                <Card className="apple-card">
                  <div className="p-6">
                    <StackBuilder 
                      stack={currentStack} 
                      setStack={setStack} 
                      onSave={saveStack}
                      onViewPricing={() => {}}
                      currencySymbol={currencySymbol}
                      pricingView={true}
                      onViewSummary={() => setCurrentTab("summary")}
                      onBack={() => setCurrentTab("builder")}
                    />
                  </div>
                </Card>
              </>
            )}
            
            {currentTab === "summary" && (
              <>
                <div className="my-6 text-center max-w-2xl mx-auto">
                  <h2 className="text-xl font-medium text-gray-700">Project Summary</h2>
                  <p className="text-sm text-gray-500 mt-2">Review your complete project with all details.</p>
                </div>
                
                <Card className="apple-card">
                  <Summary 
                    stack={currentStack} 
                    onBack={() => setCurrentTab("pricing")} 
                    currencySymbol={currencySymbol} 
                  />
                </Card>
              </>
            )}
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
          <ProcessSteps 
            currentStep={1} 
            steps={[
              "Create Project", 
              "Value Delivery Stack", 
              "Costing Review & Pricing", 
              "Final Summary"
            ]} 
            className="absolute top-10"
          />
          <ProjectCreation onProjectCreate={handleProjectCreate} />
        </div>
      )}
    </div>
  );
};

export default Index;
