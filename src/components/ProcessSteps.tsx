
import React from "react";

interface ProcessStepsProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

const ProcessSteps = ({ currentStep, steps, className = "" }: ProcessStepsProps) => {
  return (
    <div className={`flex justify-center items-center space-x-4 w-full py-4 ${className}`}>
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`h-0.5 w-12 md:w-20 ${
                  isCompleted ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            )}
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                  ${isActive 
                    ? 'bg-black text-white' 
                    : isCompleted 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {index + 1}
              </div>
              <span 
                className={`text-xs mt-1 text-center hidden md:block ${
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
