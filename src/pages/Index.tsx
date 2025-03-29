
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StackBuilder from "@/components/StackBuilder";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,
  JapaneseYen,
  Menu,
  Save
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const currencyOptions = [
  { value: "USD", label: "USD", icon: DollarSign },
  { value: "EUR", label: "EUR", icon: Euro },
  { value: "GBP", label: "GBP", icon: PoundSterling },
  { value: "JPY", label: "JPY", icon: JapaneseYen },
  { value: "INR", label: "INR", icon: IndianRupee },
];

const Index = () => {
  const [currentTab, setCurrentTab] = useState<"builder" | "summary">("builder");
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
    isAgencyFeesPercentage: false,
    effectiveAgencyFees: 0,
    isMarketingPercentage: false,
    effectiveMarketingExpenses: 0,
    contingencyBuffer: 0,
    totalRequiredIncome: 0
  });
  const [savedStacks, setSavedStacks] = useState<Stack[]>([]);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(true);
  const [newProjectName, setNewProjectName] = useState("New Stack");
  const [newProjectCurrency, setNewProjectCurrency] = useState("USD");
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const savedStacksData = localStorage.getItem('stacks');
    if (savedStacksData) {
      try {
        const parsedStacks = JSON.parse(savedStacksData);
        setSavedStacks(parsedStacks);
      } catch (error) {
        console.error('Error loading saved stacks:', error);
      }
    }
  }, []);

  const saveStack = () => {
    const stackToSave = {...currentStack};
    console.log('Saving stack with values:', {
      finalPrice: stackToSave.finalPrice,
      netProfit: stackToSave.netProfit,
      marginPercent: stackToSave.marginPercent
    });
    
    const exists = savedStacks.findIndex(stack => stack.id === stackToSave.id);
    let updatedStacks;
    
    if (exists >= 0) {
      updatedStacks = [...savedStacks];
      updatedStacks[exists] = stackToSave;
    } else {
      updatedStacks = [...savedStacks, stackToSave];
    }
    
    setSavedStacks(updatedStacks);
    localStorage.setItem('stacks', JSON.stringify(updatedStacks));
    
    toast({
      title: "Stack saved",
      description: `"${stackToSave.name}" has been saved successfully.`,
    });
  };

  const setStack = (newStack: Stack) => {
    console.log('Setting stack in Index with values:', {
      finalPrice: newStack.finalPrice,
      netProfit: newStack.netProfit,
      marginPercent: newStack.marginPercent
    });
    setCurrentStack(newStack);
  };

  const createNewProject = () => {
    setCurrentStack({
      id: crypto.randomUUID(),
      name: newProjectName,
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
      currency: newProjectCurrency,
      isReferralPercentage: false,
      effectiveReferralCost: 0,
      isAgencyFeesPercentage: false,
      effectiveAgencyFees: 0,
      isMarketingPercentage: false,
      effectiveMarketingExpenses: 0,
      contingencyBuffer: 0,
      totalRequiredIncome: 0
    });
    setShowNewProjectDialog(false);
    setCurrentTab("builder");
  };

  const loadStack = (stackId: string) => {
    const stack = savedStacks.find(s => s.id === stackId);
    if (stack) {
      setCurrentStack(stack);
      setCurrentTab("builder");
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

  const handleNewProject = () => {
    setNewProjectName("New Stack");
    setNewProjectCurrency("USD");
    setShowNewProjectDialog(true);
  };

  return (
    <div className="min-h-screen">
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
            <h1 className="text-2xl font-semibold text-apple-neutral tracking-tight">Project Stack Builder</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={saveStack}
              className="flex items-center gap-1 border-gray-200 hover:bg-gray-100"
            >
              <Save size={16} />
              Save Progress
            </Button>
          </div>
        </div>
        
        <div className="px-6 md:px-8 pb-4">
          <Tabs 
            value={currentTab}
            onValueChange={(value) => setCurrentTab(value as "builder" | "summary")}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-[300px] grid-cols-2 bg-[#f1f5fd] p-1 rounded-xl">
              <TabsTrigger 
                value="builder"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
              >
                Builder
              </TabsTrigger>
              <TabsTrigger 
                value="summary" 
                disabled={currentStack.modules.length === 0}
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
              >
                Summary
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className={currentTab === "builder" ? "block" : "hidden"}>
          <Card className="apple-card">
            <StackBuilder 
              stack={currentStack} 
              setStack={setStack} 
              onSave={saveStack}
              onViewSummary={() => setCurrentTab("summary")} 
              currencySymbol={getCurrencySymbol(currentStack.currency)}
            />
          </Card>
        </div>
        
        <div className={currentTab === "summary" ? "block" : "hidden"}>
          <Card className="apple-card">
            <Summary 
              stack={currentStack} 
              onBack={() => setCurrentTab("builder")} 
              currencySymbol={getCurrencySymbol(currentStack.currency)} 
            />
          </Card>
        </div>
      </main>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up your new project stack with a name and currency.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">
                Name
              </Label>
              <Input
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Select
                value={newProjectCurrency}
                onValueChange={setNewProjectCurrency}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select currency" />
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
          </div>
          <DialogFooter>
            <Button onClick={createNewProject} className="bg-black hover:bg-black/80">
              Create Stack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
