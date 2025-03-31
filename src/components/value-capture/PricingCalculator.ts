import { Stack } from "@/types/stack";

export const calculateFinalPrice = (stack: Stack) => {
  // Get the total cost from the modules
  const deliveryCost = stack.totalCost || 0;
  
  // Calculate contingency buffer
  const contingencyAmount = (deliveryCost * (stack.contingencyBuffer || 0)) / 100;
  const costWithContingency = deliveryCost + contingencyAmount;
  
  // Calculate the required profit based on the desired margin
  // Profit = (Cost * Margin) / (100 - Margin)
  const desiredMargin = stack.desiredMargin || 0;
  let requiredProfit = 0;
  
  if (desiredMargin < 100) {
    requiredProfit = (costWithContingency * desiredMargin) / (100 - desiredMargin);
  } else {
    // Handle edge case where margin is 100%
    requiredProfit = costWithContingency * 10; // Arbitrary high multiplier
  }
  
  // Net revenue needed before value capture costs
  const totalRequiredIncome = costWithContingency + requiredProfit;
  
  // Calculate effective costs with percentages based on final price
  let finalPrice = totalRequiredIncome;
  let previousFinalPrice = 0;
  
  // Iteratively calculate the final price to account for percentage-based costs
  for (let i = 0; i < 10; i++) { // Limited iterations to prevent infinite loops
    previousFinalPrice = finalPrice;
    
    // Calculate value capture costs
    const referralAmount = stack.isReferralPercentage
      ? finalPrice * (stack.referralCosts || 0) / 100
      : (stack.referralCosts || 0);
      
    const agencyAmount = stack.isAgencyFeesPercentage
      ? finalPrice * (stack.agencyFees || 0) / 100
      : (stack.agencyFees || 0);
      
    const marketingAmount = stack.isMarketingPercentage
      ? finalPrice * (stack.marketingExpenses || 0) / 100
      : (stack.marketingExpenses || 0);
    
    const valueCaptureTotal = referralAmount + agencyAmount + marketingAmount;
    
    // Recalculate final price
    finalPrice = totalRequiredIncome + valueCaptureTotal;
    
    // Check if we've converged
    if (Math.abs(finalPrice - previousFinalPrice) < 0.01) {
      break;
    }
  }
  
  // Round to the nearest 100 if needed
  if (stack.roundToNearest100) {
    // Round to the nearest 100 but preserve the decimal places
    const integerPart = Math.ceil(finalPrice / 100) * 100;
    // We'll keep the decimal places for display purposes
    finalPrice = integerPart;
  }
  
  return {
    finalPrice,
    costWithContingency,
    totalRequiredIncome
  };
};

export const calculateEffectiveCosts = (stack: Stack, finalPrice: number) => {
  // Calculate actual costs based on final price
  const effectiveReferralCost = stack.isReferralPercentage
    ? finalPrice * (stack.referralCosts || 0) / 100
    : (stack.referralCosts || 0);
    
  const effectiveAgencyFees = stack.isAgencyFeesPercentage
    ? finalPrice * (stack.agencyFees || 0) / 100
    : (stack.agencyFees || 0);
    
  const effectiveMarketingExpenses = stack.isMarketingPercentage
    ? finalPrice * (stack.marketingExpenses || 0) / 100
    : (stack.marketingExpenses || 0);
  
  const valueCaptureTotal = effectiveReferralCost + effectiveAgencyFees + effectiveMarketingExpenses;
  
  return {
    effectiveReferralCost,
    effectiveAgencyFees,
    effectiveMarketingExpenses,
    valueCaptureTotal
  };
};
