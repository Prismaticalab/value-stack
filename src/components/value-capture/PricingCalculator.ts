
import { Stack } from "@/types/stack";
import { toast } from "@/hooks/use-toast";

export const calculateFinalPrice = (stack: Stack) => {
  console.log('Starting price calculation with values:', {
    totalCost: stack.totalCost,
    referralCosts: stack.referralCosts,
    isReferralPercentage: stack.isReferralPercentage,
    agencyFees: stack.agencyFees,
    isAgencyFeesPercentage: stack.isAgencyFeesPercentage,
    marketingExpenses: stack.marketingExpenses,
    isMarketingPercentage: stack.isMarketingPercentage,
    desiredMargin: stack.desiredMargin,
    contingencyBuffer: stack.contingencyBuffer
  });
  
  // Calculate base cost with contingency
  const baseModulesCost = stack.totalCost;
  const costWithContingency = baseModulesCost * (1 + (stack.contingencyBuffer || 0) / 100);
  
  // Calculate the total required net revenue (before value capture costs)
  const totalRequiredIncome = costWithContingency * (1 + stack.desiredMargin / 100);
  
  // For percentage-based costs, we need to use the formula:
  // finalPrice = totalRequiredIncome / (1 - sumOfPercentages)
  
  let percentageTotalDeduction = 0;
  let fixedCostsTotal = 0;
  
  if (stack.isReferralPercentage) {
    percentageTotalDeduction += (stack.referralCosts / 100);
  } else {
    fixedCostsTotal += stack.referralCosts;
  }
  
  if (stack.isAgencyFeesPercentage) {
    percentageTotalDeduction += (stack.agencyFees / 100);
  } else {
    fixedCostsTotal += stack.agencyFees;
  }
  
  if (stack.isMarketingPercentage) {
    percentageTotalDeduction += (stack.marketingExpenses / 100);
  } else {
    fixedCostsTotal += stack.marketingExpenses;
  }
  
  // Prevent division by zero or negative numbers
  let denominator = 1 - percentageTotalDeduction;
  
  if (denominator <= 0.01) {
    denominator = 0.01; // Fallback to avoid errors
    
    toast({
      title: "Warning",
      description: "The percentage costs are too high. Adjusting calculations to prevent errors.",
      variant: "destructive"
    });
  }
  
  // Calculate the final price needed to cover all costs
  // If we have percentage costs:
  // finalPrice * (1 - percentages) = totalRequiredIncome + fixedCosts
  let finalPrice;
  
  if (percentageTotalDeduction > 0) {
    finalPrice = (totalRequiredIncome + fixedCostsTotal) / denominator;
  } else {
    finalPrice = totalRequiredIncome + fixedCostsTotal;
  }
  
  // Round based on the rounding preference - default to nearest 50 if not set
  if (stack.roundToNearest100) {
    finalPrice = Math.ceil(finalPrice / 100) * 100;
  } else {
    finalPrice = Math.ceil(finalPrice / 50) * 50;
  }
  
  console.log('Calculated price before returning:', { 
    finalPrice, 
    costWithContingency, 
    totalRequiredIncome,
    percentageTotalDeduction,
    denominator,
    fixedCostsTotal
  });
  
  return {
    finalPrice,
    costWithContingency,
    totalRequiredIncome
  };
};

export const calculateEffectiveCosts = (stack: Stack, finalPrice: number) => {
  // Calculate effective costs based on the final price
  const effectiveReferralCost = stack.isReferralPercentage 
    ? finalPrice * (stack.referralCosts / 100) 
    : stack.referralCosts;
    
  const effectiveAgencyFees = stack.isAgencyFeesPercentage 
    ? finalPrice * (stack.agencyFees / 100) 
    : stack.agencyFees;
    
  const effectiveMarketingExpenses = stack.isMarketingPercentage 
    ? finalPrice * (stack.marketingExpenses / 100) 
    : stack.marketingExpenses;
  
  // Total value capture costs
  const valueCaptureTotal = effectiveReferralCost + effectiveAgencyFees + effectiveMarketingExpenses;
  
  return {
    effectiveReferralCost,
    effectiveAgencyFees,
    effectiveMarketingExpenses,
    valueCaptureTotal
  };
};
