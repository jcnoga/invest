
export type Frequency = 'mensal' | 'trimestral' | 'anual';
export type RateType = 'mensal' | 'anual';

export interface SimulationParams {
  initialCapital: number;
  periodicContribution: number;
  contributionFrequency: Frequency;
  interestRate: number;
  rateType: RateType;
  period: number; // in months
  reinvest: boolean;
  inflation: number; // annual %
  taxRate: number; // %
}

export interface MonthlyData {
  month: number;
  date: string;
  totalInvested: number;
  interest: number;
  totalInterest: number;
  balance: number;
}

export interface SimulationResult {
  monthlyData: MonthlyData[];
  totalInvested: number;
  totalInterest: number;
  finalGrossValue: number;
  finalNetValue: number;
  taxAmount: number;
  totalGains: number;
  realGains: number;
}
