
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Paperclip, ExternalLink, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface DocumentAttachmentProps {
  documentUrl?: string;
  documentName?: string;
  onUpdate: (documentUrl?: string, documentName?: string) => void;
  isLocked: boolean;
}

const DocumentAttachment = ({
  documentUrl,
  documentName,
  onUpdate,
  isLocked
}: DocumentAttachmentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Here you would normally upload the file to a server and get a URL back
    // For this example, we'll create an object URL
    const documentUrl = URL.createObjectURL(file);
    
    onUpdate(documentUrl, file.name);
    
    toast({
      title: "Document attached",
      description: `"${file.name}" has been attached to this module.`
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeDocument = () => {
    onUpdate(undefined, undefined);
    
    toast({
      title: "Document removed",
      description: "The document has been removed from this module."
    });
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Document Attachment</Label>
        {!documentUrl && !isLocked && (
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
      
      {documentUrl ? (
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md mt-2">
          <div className="flex items-center">
            <Paperclip size={16} className="text-gray-500 mr-2" />
            <span className="text-sm truncate max-w-xs">{documentName}</span>
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
                    onClick={() => window.open(documentUrl, '_blank')}
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
                    disabled={isLocked}
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
  );
};

export default DocumentAttachment;
