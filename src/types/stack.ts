
export interface Module {
  id: string;
  name: string;
  value: string;
  stakeholder: 'internal' | 'external';
  stakeholderName: string;
  costType: 'fixed' | 'variable';
  cost: number;
  costUnit?: string;
  costQuantity?: number;
  timeImpact: number;
  timeUnit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  nonNegotiable?: boolean;
  documentUrl?: string;
  documentName?: string;
}

export interface Stack {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  modules: Module[];
  locked: boolean;
  totalCost: number;
  agencyFees: number;
  isAgencyFeesPercentage: boolean;
  effectiveAgencyFees: number;
  referralCosts: number;
  isReferralPercentage: boolean;
  effectiveReferralCost: number;
  marketingExpenses: number;
  isMarketingPercentage: boolean;
  effectiveMarketingExpenses: number;
  desiredMargin: number;
  finalPrice: number;
  netProfit: number;
  marginPercent: number;
  createdAt: string;
  currency: string;
  contingencyBuffer: number;
  totalRequiredIncome: number;
  roundToNearest100?: boolean;
  isInitialized?: boolean;
}
