
import React from "react";

interface ProcessStepsProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

const ProcessSteps = ({ currentStep, steps, className = "" }: ProcessStepsProps) => {
  return (
    <div className={`flex justify-center items-center space-x-2 md:space-x-4 w-full py-4 px-2 overflow-x-auto ${className}`}>
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`h-0.5 w-6 md:w-12 lg:w-16 ${
                  isCompleted ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            )}
            <div className="flex flex-col items-center shrink-0">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                  ${isActive 
                    ? 'bg-[#4ade80] text-black border border-black' 
                    : isCompleted 
                      ? 'bg-[#4ade80] text-black' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {index + 1}
              </div>
              <span 
                className={`text-xs mt-1 text-center whitespace-nowrap ${
                  isActive ? 'font-medium text-black' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessSteps;
