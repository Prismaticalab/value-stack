
import React, { useRef } from "react";
import { Stack } from "@/types/stack";
import SummaryHeader from "./summary/SummaryHeader";
import StakeholderDistributionChart from "./summary/StakeholderDistributionChart";
import CostBreakdownCard from "./summary/CostBreakdownCard";
import ModuleDetailsList from "./summary/ModuleDetailsList";
import { usePdfExport } from "./summary/utils";

interface SummaryProps {
  stack: Stack;
  onBack: () => void;
  currencySymbol: string;
}

const Summary = ({ stack, onBack, currencySymbol }: SummaryProps) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const { generatePdf } = usePdfExport();
  
  console.log('Summary component rendering with stack values:', {
    finalPrice: stack.finalPrice,
    netProfit: stack.netProfit, 
    marginPercent: stack.marginPercent,
    totalCost: stack.totalCost,
    effectiveReferralCost: stack.effectiveReferralCost,
    effectiveAgencyFees: stack.effectiveAgencyFees,
    effectiveMarketingExpenses: stack.effectiveMarketingExpenses
  });

  const downloadPdf = async () => {
    if (summaryRef.current) {
      const filename = `${stack.name.replace(/\s+/g, "-")}_project-quote.pdf`;
      await generatePdf(summaryRef.current, filename);
    }
  };

  return (
    <div className="space-y-6" ref={summaryRef}>
      <SummaryHeader
        onBack={onBack}
        onDownload={downloadPdf}
        name={stack.name}
        moduleCount={stack.modules.length}
        finalPrice={stack.finalPrice}
        currencySymbol={currencySymbol}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StakeholderDistributionChart 
          modules={stack.modules}
          currencySymbol={currencySymbol}
        />

        <CostBreakdownCard 
          stack={stack}
          currencySymbol={currencySymbol}
        />
      </div>

      <ModuleDetailsList 
        modules={stack.modules}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};

export default Summary;
