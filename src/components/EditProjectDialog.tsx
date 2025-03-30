
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  projectOwner,
}: EditProjectDialogProps) => {
  const [name, setName] = useState(projectName);
  const [description, setDescription] = useState(projectDescription);
  const [owner, setOwner] = useState(projectOwner);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Reset the form values when the dialog opens
    setName(projectName);
    setDescription(projectDescription);
    setOwner(projectOwner);
    setHasChanges(false);
  }, [projectName, projectDescription, projectOwner, open]);

  useEffect(() => {
    // Check if any field has changed
    setHasChanges(
      name !== projectName || 
      description !== projectDescription || 
      owner !== projectOwner
    );
  }, [name, description, owner, projectName, projectDescription, projectOwner]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Enter project name"}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="project-description">Brief Description</Label>
              <span className="text-xs text-gray-500">
                {description.length}/150
              </span>
            </div>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 150) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Brief description of your project"
              className="resize-none"
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Brief description of your project"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-owner">Project Owner *</Label>
            <Input
              id="project-owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Enter project owner name"
              required
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Enter project owner name"}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(name, description, owner)}
            disabled={!hasChanges || !name || !owner}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
