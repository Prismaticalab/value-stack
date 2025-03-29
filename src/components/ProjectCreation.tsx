
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stack } from "@/types/stack";
import { DollarSign, Euro, PoundSterling, IndianRupee, JapaneseYen, ArrowRight } from "lucide-react";

interface ProjectCreationProps {
  onProjectCreate: (name: string, currency: string) => void;
}

const currencyOptions = [
  { value: "USD", label: "USD", icon: DollarSign },
  { value: "EUR", label: "EUR", icon: Euro },
  { value: "GBP", label: "GBP", icon: PoundSterling },
  { value: "JPY", label: "JPY", icon: JapaneseYen },
  { value: "INR", label: "INR", icon: IndianRupee },
];

const ProjectCreation = ({ onProjectCreate }: ProjectCreationProps) => {
  const [projectName, setProjectName] = useState("New Stack");
  const [currency, setCurrency] = useState("USD");

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      return;
    }
    onProjectCreate(projectName, currency);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
        <CardDescription>
          Start by giving your project a name and selecting a currency.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter a project name"
            className="border-gray-200 focus:border-black focus:ring-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency" className="w-full border-gray-200 focus:border-black focus:ring-black">
              <SelectValue placeholder="Select a currency" />
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
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateProject} 
          className="w-full bg-black hover:bg-black/80 flex items-center justify-center gap-2"
        >
          <span>Start Building</span>
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCreation;
