
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

interface SummaryHeaderProps {
  onBack: () => void;
  onDownload: () => void;
  name: string;
  moduleCount: number;
  finalPrice: number;
  currencySymbol: string;
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  onBack,
  onDownload,
  name,
  moduleCount,
  finalPrice,
  currencySymbol,
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Builder
        </Button>
        <Button
          variant="outline"
          onClick={onDownload}
          className="flex items-center gap-1"
        >
          <Download size={16} />
          Export PDF
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="text-sm text-gray-500">
          {moduleCount} modules, {currencySymbol}{finalPrice.toFixed(2)} total price
        </p>
      </div>
    </>
  );
};

export default SummaryHeader;
