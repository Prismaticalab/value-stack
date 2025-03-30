
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Stack } from "@/types/stack";
import { useToast } from "@/hooks/use-toast";

interface ProjectContextProps {
  currentStack: Stack;
  setStack: (stack: Stack) => void;
  savedStacks: Stack[];
  setSavedStacks: (stacks: Stack[]) => void;
  saveStack: () => void;
  loadStack: (stackId: string) => void;
  deleteStack: (stackId: string) => void;
  handleUpdateProject: (name: string, description: string, owner: string) => void;
  handleProjectCreate: (name: string, currency: string, description: string, owner: string) => void;
  handleNewProject: () => void;
  getCurrencySymbol: (currencyCode: string) => string;
  currencySymbol: string;
}

const initialStack: Stack = {
  id: crypto.randomUUID(),
  name: "",
  description: "",
  owner: "",
  modules: [],
  locked: false,
  totalCost: 0,
  agencyFees: 0,
  referralCosts: 0,
  marketingExpenses: 0,
  desiredMargin: 0,
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
  totalRequiredIncome: 0,
  isInitialized: false
};

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentStack, setCurrentStack] = useState<Stack>(initialStack);
  const [savedStacks, setSavedStacks] = useState<Stack[]>([]);
  const { toast } = useToast();

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

  const loadStack = (stackId: string) => {
    const stack = savedStacks.find(s => s.id === stackId);
    if (stack) {
      setCurrentStack(stack);
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

  const setStack = (newStack: Stack) => {
    console.log('Setting stack with values:', {
      finalPrice: newStack.finalPrice,
      netProfit: newStack.netProfit,
      marginPercent: newStack.marginPercent
    });
    setCurrentStack(newStack);
  };

  const handleProjectCreate = (name: string, currency: string, description: string, owner: string) => {
    setCurrentStack({
      ...currentStack,
      name: name,
      currency: currency,
      description: description,
      owner: owner,
      isInitialized: true
    });
    toast({
      title: "Project created",
      description: `"${name}" has been created. You can now start building your stack.`,
    });
  };

  const handleUpdateProject = (name: string, description: string, owner: string) => {
    setCurrentStack({
      ...currentStack,
      name,
      description,
      owner
    });
    
    toast({
      title: "Project updated",
      description: "Project details have been updated successfully.",
    });
  };

  const handleNewProject = () => {
    setCurrentStack({
      ...initialStack,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
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

  const currencySymbol = getCurrencySymbol(currentStack.currency);

  return (
    <ProjectContext.Provider
      value={{
        currentStack,
        setStack,
        savedStacks,
        setSavedStacks,
        saveStack,
        loadStack,
        deleteStack,
        handleUpdateProject,
        handleProjectCreate,
        handleNewProject,
        getCurrencySymbol,
        currencySymbol
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
