
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Stack } from "@/types/stack";
import { DollarSign, Euro, PoundSterling, IndianRupee, JapaneseYen, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectCreationProps {
  onProjectCreate: (name: string, currency: string, description: string, owner: string) => void;
}

const currencyOptions = [
  { value: "USD", label: "USD", icon: DollarSign },
  { value: "EUR", label: "EUR", icon: Euro },
  { value: "GBP", label: "GBP", icon: PoundSterling },
  { value: "JPY", label: "JPY", icon: JapaneseYen },
  { value: "INR", label: "INR", icon: IndianRupee },
];

const ProjectCreation = ({ onProjectCreate }: ProjectCreationProps) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [errors, setErrors] = useState({
    name: false,
    owner: false
  });
  const { toast } = useToast();

  const handleCreateProject = () => {
    // Validate fields
    const newErrors = {
      name: !projectName.trim(),
      owner: !owner.trim()
    };
    
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.owner) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields to continue.",
        variant: "destructive"
      });
      return;
    }
    
    onProjectCreate(projectName, currency, description, owner);
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
          <Label htmlFor="projectName" className="flex items-center">
            Project Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter a project name"
            className={`border-gray-200 focus:border-black focus:ring-black ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">Project name is required</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">
            Brief Description <span className="text-gray-400 text-xs ml-1">(max 150 characters)</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                setDescription(e.target.value);
              }
            }}
            placeholder="Enter a brief project description"
            className="border-gray-200 focus:border-black focus:ring-black resize-none"
            maxLength={150}
          />
          <div className="text-right text-xs text-gray-400">
            {description.length}/150
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="owner" className="flex items-center">
            Project Owner <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Enter owner name/details"
            className={`border-gray-200 focus:border-black focus:ring-black ${errors.owner ? 'border-red-500' : ''}`}
          />
          {errors.owner && <p className="text-red-500 text-sm mt-1">Project owner is required</p>}
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
