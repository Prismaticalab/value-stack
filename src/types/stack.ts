
export interface Module {
  id: string;
  name: string;
  value: string;
  stakeholder: "internal" | "external";
  cost: number;
  timeImpact: number; // in hours
  deliveryImpact: number; // scale 1-10
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
