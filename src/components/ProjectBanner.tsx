
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProjectBannerProps {
  title: string;
  description?: string;
  owner?: string;
  onEditClick: () => void;
}

const ProjectBanner = ({ title, description, owner, onEditClick }: ProjectBannerProps) => {
  return (
    <div className="relative mx-auto max-w-3xl bg-white shadow-lg rounded-lg p-6 mt-4 mb-6 text-center border border-gray-100 transition-all hover:shadow-xl">
      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          onClick={onEditClick}
        >
          <Edit size={16} />
        </Button>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-semibold text-apple-neutral tracking-tight mb-2">
        {title}
      </h1>
      
      {description && (
        <p className="text-sm text-gray-500 mt-1 max-w-2xl mx-auto">
          {description}
        </p>
      )}
      
      {owner && (
        <p className="text-sm text-gray-500 mt-2">
          Owner: <span className="font-semibold">{owner}</span>
        </p>
      )}
    </div>
  );
};

export default ProjectBanner;
