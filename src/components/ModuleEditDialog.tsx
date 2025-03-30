
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Module } from "@/types/stack";
import { Flag, Paperclip, X, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ModuleEditDialogProps {
  module: Module;
  onSave: (updatedModule: Module) => void;
  onCancel: () => void;
  currencySymbol: string;
}

const ModuleEditDialog = ({ module, onSave, onCancel, currencySymbol }: ModuleEditDialogProps) => {
  const [editedModule, setEditedModule] = useState<Module>({ ...module });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [costInputActive, setCostInputActive] = useState(false);

  const handleChange = (field: keyof Module, value: any) => {
    setEditedModule({ ...editedModule, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For this example, we'll create an object URL
    const documentUrl = URL.createObjectURL(file);
    
    setEditedModule({
      ...editedModule,
      documentUrl,
      documentName: file.name
    });
    
    toast({
      title: "Document attached",
      description: `"${file.name}" has been attached to this module.`
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeDocument = () => {
    setEditedModule({
      ...editedModule,
      documentUrl: undefined,
      documentName: undefined
    });
    
    toast({
      title: "Document removed",
      description: "The document has been removed from this module."
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Module Name</Label>
            <Input
              id="edit-name"
              value={editedModule.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border-gray-200 focus:border-black focus:ring-black"
              placeholder="Module name"
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Module name"}
            />
          </div>
          
          {/* Non-negotiable setting - moved next to the text */}
          <div className="flex items-center gap-2">
            <Label htmlFor="edit-non-negotiable" className="cursor-pointer flex items-center gap-2">
              <span>Non-Negotiable</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-help text-gray-400 hover:text-gray-500">
                    <Flag size={14} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>When marked as non-negotiable, this module cannot be deleted.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Switch
              id="edit-non-negotiable"
              checked={editedModule.nonNegotiable || false}
              onCheckedChange={(checked) => handleChange("nonNegotiable", checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-value">Purpose of Module</Label>
            <Textarea
              id="edit-value"
              value={editedModule.value}
              onChange={(e) => handleChange("value", e.target.value)}
              className="border-gray-200 focus:border-black focus:ring-black min-h-24"
              placeholder="Describe the purpose of this module..."
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Describe the purpose of this module..."}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stakeholder</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={editedModule.stakeholder}
                  onValueChange={(value) => handleChange(
                    "stakeholder",
                    value as "internal" | "external"
                  )}
                >
                  <SelectTrigger className="border-gray-200 focus:ring-black">
                    <SelectValue placeholder="Select stakeholder" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  className="border-gray-200 focus:border-black focus:ring-black"
                  placeholder="Stakeholder name"
                  value={editedModule.stakeholderName}
                  onChange={(e) => handleChange("stakeholderName", e.target.value)}
                  onFocus={(e) => e.target.placeholder = ""}
                  onBlur={(e) => e.target.placeholder = "Stakeholder name"}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Time Impact</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="border-gray-200 focus:border-black focus:ring-black"
                  type="number"
                  min="0"
                  step="1"
                  value={editedModule.timeImpact}
                  onChange={(e) => handleChange("timeImpact", parseInt(e.target.value) || 0)}
                />

                <Select
                  value={editedModule.timeUnit}
                  onValueChange={(value) => handleChange(
                    "timeUnit",
                    value as "minutes" | "hours" | "days" | "weeks" | "months"
                  )}
                >
                  <SelectTrigger className="border-gray-200 focus:ring-black">
                    <SelectValue placeholder="Select time unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="text-sm font-medium mr-4">Cost</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Fixed</span>
                <Switch
                  checked={editedModule.costType === "variable"}
                  onCheckedChange={(checked) => handleChange(
                    "costType",
                    checked ? "variable" : "fixed"
                  )}
                />
                <span className="text-xs text-gray-500">Variable</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">{currencySymbol}</span>
                </div>
                <Input
                  className="pl-7 border-gray-200 focus:border-black focus:ring-black"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="0.01"
                  placeholder={costInputActive ? "" : "0"}
                  value={costInputActive ? editedModule.cost : editedModule.cost === 0 ? "" : editedModule.cost}
                  onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
                  onFocus={() => setCostInputActive(true)}
                  onBlur={() => setCostInputActive(false)}
                />
              </div>

              {editedModule.costType === "variable" && (
                <>
                  <Input
                    className="border-gray-200 focus:border-black focus:ring-black"
                    placeholder="Type the nature of unit (e.g., hours, users, 1000 copies, etc)"
                    value={editedModule.costUnit || ""}
                    onChange={(e) => handleChange("costUnit", e.target.value)}
                    onFocus={(e) => e.target.placeholder = ""}
                    onBlur={(e) => e.target.placeholder = "Type the nature of unit (e.g., hours, users, 1000 copies, etc)"}
                  />

                  <Input
                    className="border-gray-200 focus:border-black focus:ring-black"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    placeholder="Number of units needed"
                    value={editedModule.costQuantity || 1}
                    onChange={(e) => handleChange("costQuantity", parseInt(e.target.value) || 1)}
                    onFocus={(e) => e.target.placeholder = ""}
                    onBlur={(e) => e.target.placeholder = "Number of units needed"}
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Document attachment section - updated with icon instead of button */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Document Attachment</Label>
              {!editedModule.documentUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-500 hover:bg-black hover:text-white transition-colors flex items-center gap-1"
                  onClick={triggerFileInput}
                >
                  <Paperclip size={16} />
                  <span>Attach</span>
                </Button>
              )}
            </div>
            
            {editedModule.documentUrl ? (
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md mt-2">
                <div className="flex items-center">
                  <Paperclip size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm truncate max-w-xs">{editedModule.documentName}</span>
                </div>
                <div className="flex space-x-2">
                  {/* Link to open document */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-black hover:text-white transition-colors"
                          onClick={() => window.open(editedModule.documentUrl, '_blank')}
                        >
                          <ExternalLink size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open document</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Button to remove document */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                          onClick={removeDocument}
                        >
                          <X size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove document</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ) : (
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(editedModule)} className="hover:bg-black hover:text-white transition-colors">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleEditDialog;
