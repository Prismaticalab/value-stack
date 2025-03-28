
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StackBuilder from "@/components/StackBuilder";
import ProjectList from "@/components/ProjectList";
import Summary from "@/components/Summary";
import { Stack } from "@/types/stack";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,
  JapaneseYen
} from "lucide-react";

const currencyOptions = [
  { value: "USD", label: "USD", icon: DollarSign },
  { value: "EUR", label: "EUR", icon: Euro },
  { value: "GBP", label: "GBP", icon: PoundSterling },
  { value: "JPY", label: "JPY", icon: JapaneseYen },
  { value: "INR", label: "INR", icon: IndianRupee },
];

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
    currency: "USD",
    isReferralPercentage: false,
    effectiveReferralCost: 0,
  });
  const [savedStacks, setSavedStacks] = useState<Stack[]>([]);
  const { toast } = useToast();

  const saveStack = () => {
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
      currency: currentStack.currency,
      isReferralPercentage: false,
      effectiveReferralCost: 0,
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

  const getCurrencySymbol = (currencyCode: string) => {
    switch(currencyCode) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "JPY": return "¥";
      case "INR": return "₹";
      default: return "$";
    }
  };

  const handleCurrencyChange = (value: string) => {
    setCurrentStack(prev => ({
      ...prev,
      currency: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-black">Project Stack Builder</h1>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <Select 
                value={currentStack.currency} 
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon size={14} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
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
              currencySymbol={getCurrencySymbol(currentStack.currency)}
            />
          )}
          
          {view === "projects" && (
            <ProjectList 
              stacks={savedStacks} 
              onLoadStack={loadStack} 
              onDeleteStack={deleteStack} 
              onCreateNew={createNewStack} 
              getCurrencySymbol={getCurrencySymbol}
            />
          )}
          
          {view === "summary" && (
            <Summary 
              stack={currentStack} 
              onBack={() => setView("builder")} 
              currencySymbol={getCurrencySymbol(currentStack.currency)} 
            />
          )}
        </Card>
      </main>
    </div>
  );
};

export default Index;
