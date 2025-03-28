
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StackBuilder from "@/components/StackBuilder";
import ProjectList from "@/components/ProjectList";
import Summary from "@/components/Summary";
import { Stack } from "@/types/stack";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [view, setView] = useState<"builder" | "projects" | "summary">("builder");
  const [currentStack, setCurrentStack] = useState<Stack>({
    id: crypto.randomUUID(),
    name: "New Stack",
    modules: [],
    locked: false,
    totalCost: 0,
    agencyFees: 0,
    referralCosts: 0,
    marketingExpenses: 0,
    desiredMargin: 20,
    finalPrice: 0,
    netProfit: 0,
    marginPercent: 0,
    createdAt: new Date().toISOString(),
  });
  const [savedStacks, setSavedStacks] = useState<Stack[]>([]);
  const { toast } = useToast();

  const saveStack = () => {
    // Check if stack exists, update it, otherwise add new
    const exists = savedStacks.findIndex(stack => stack.id === currentStack.id);
    let updatedStacks;
    
    if (exists >= 0) {
      updatedStacks = [...savedStacks];
      updatedStacks[exists] = {...currentStack};
    } else {
      updatedStacks = [...savedStacks, {...currentStack}];
    }
    
    setSavedStacks(updatedStacks);
    localStorage.setItem('stacks', JSON.stringify(updatedStacks));
    
    toast({
      title: "Stack saved",
      description: `"${currentStack.name}" has been saved successfully.`,
    });
  };

  const createNewStack = () => {
    setCurrentStack({
      id: crypto.randomUUID(),
      name: "New Stack",
      modules: [],
      locked: false,
      totalCost: 0,
      agencyFees: 0,
      referralCosts: 0,
      marketingExpenses: 0,
      desiredMargin: 20,
      finalPrice: 0,
      netProfit: 0,
      marginPercent: 0,
      createdAt: new Date().toISOString(),
    });
    setView("builder");
  };

  const loadStack = (stackId: string) => {
    const stack = savedStacks.find(s => s.id === stackId);
    if (stack) {
      setCurrentStack(stack);
      setView("builder");
    }
  };

  const deleteStack = (stackId: string) => {
    const updatedStacks = savedStacks.filter(s => s.id !== stackId);
    setSavedStacks(updatedStacks);
    localStorage.setItem('stacks', JSON.stringify(updatedStacks));
    
    toast({
      title: "Stack deleted",
      description: "The stack has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-black">Stack Builder</h1>
          <div className="flex space-x-2">
            <Button 
              variant={view === "builder" ? "default" : "outline"}
              onClick={() => setView("builder")}
              className={view === "builder" ? "bg-[#9B87F5] hover:bg-[#8A76E4]" : ""}
            >
              Builder
            </Button>
            <Button 
              variant={view === "projects" ? "default" : "outline"}
              onClick={() => setView("projects")}
              className={view === "projects" ? "bg-[#9B87F5] hover:bg-[#8A76E4]" : ""}
            >
              Projects
            </Button>
            {currentStack.modules.length > 0 && (
              <Button 
                variant={view === "summary" ? "default" : "outline"}
                onClick={() => setView("summary")}
                className={view === "summary" ? "bg-[#9B87F5] hover:bg-[#8A76E4]" : ""}
              >
                Summary
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Card className="p-4 md:p-6 shadow-sm">
          {view === "builder" && (
            <StackBuilder 
              stack={currentStack} 
              setStack={setCurrentStack} 
              onSave={saveStack}
              onViewSummary={() => setView("summary")} 
            />
          )}
          
          {view === "projects" && (
            <ProjectList 
              stacks={savedStacks} 
              onLoadStack={loadStack} 
              onDeleteStack={deleteStack} 
              onCreateNew={createNewStack} 
            />
          )}
          
          {view === "summary" && (
            <Summary stack={currentStack} onBack={() => setView("builder")} />
          )}
        </Card>
      </main>
    </div>
  );
};

export default Index;
