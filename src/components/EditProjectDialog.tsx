
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, owner: string) => void;
  projectName: string;
  projectDescription: string;
  projectOwner: string;
}

const EditProjectDialog = ({
  open,
  onClose,
  onSave,
  projectName,
  projectDescription,
  projectOwner
}: EditProjectDialogProps) => {
  const [name, setName] = useState(projectName);
  const [description, setDescription] = useState(projectDescription);
  const [owner, setOwner] = useState(projectOwner);
  const [errors, setErrors] = useState({
    name: false,
    owner: false
  });

  useEffect(() => {
    if (open) {
      setName(projectName);
      setDescription(projectDescription);
      setOwner(projectOwner);
      setErrors({ name: false, owner: false });
    }
  }, [open, projectName, projectDescription, projectOwner]);

  const handleSave = () => {
    const newErrors = {
      name: !name.trim(),
      owner: !owner.trim()
    };
    
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.owner) {
      return;
    }
    
    onSave(name, description, owner);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project Details</DialogTitle>
          <DialogDescription>
            Update your project information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="flex items-center">
              Project Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`border-gray-200 focus:border-black focus:ring-black ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">Project name is required</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">
              Brief Description <span className="text-gray-400 text-xs ml-1">(max 150 characters)</span>
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 150) {
                  setDescription(e.target.value);
                }
              }}
              className="border-gray-200 focus:border-black focus:ring-black resize-none"
              maxLength={150}
            />
            <div className="text-right text-xs text-gray-400">
              {description.length}/150
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-owner" className="flex items-center">
              Project Owner <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="edit-owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className={`border-gray-200 focus:border-black focus:ring-black ${errors.owner ? 'border-red-500' : ''}`}
            />
            {errors.owner && <p className="text-red-500 text-sm mt-1">Project owner is required</p>}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
