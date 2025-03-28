
export interface Module {
  id: string;
  name: string;
  value: string;
  stakeholder: "internal" | "external";
  stakeholderName: string;
  costType: "fixed" | "variable";
  cost: number;
  costUnit: string;
  costQuantity: number;
  timeImpact: number;
  timeUnit: "days" | "weeks" | "months";
}

export interface Stack {
  id: string;
  name: string;
  modules: Module[];
  locked: boolean;
  totalCost: number;
  agencyFees: number;
  referralCosts: number;
  marketingExpenses: number;
  desiredMargin: number;
  finalPrice: number;
  netProfit: number;
  marginPercent: number;
  createdAt: string;
  currency: string;
}
