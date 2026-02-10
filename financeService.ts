
import type { SimulationParams, SimulationResult, MonthlyData } from '../types';

function toBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function calculateCompoundInterest(params: SimulationParams): SimulationResult {
  const {
    initialCapital,
    periodicContribution,
    contributionFrequency,
    interestRate,
    rateType,
    period,
    reinvest,
    inflation,
    taxRate,
  } = params;

  const monthlyInterestRate = rateType === 'anual'
    ? Math.pow(1 + interestRate / 100, 1 / 12) - 1
    : interestRate / 100;

  const monthlyData: MonthlyData[] = [];
  let currentBalance = initialCapital;
  let totalInvested = initialCapital;
  let totalInterest = 0;
  
  const startDate = new Date();

  for (let month = 1; month <= period; month++) {
    const interestEarned = currentBalance * monthlyInterestRate;

    if (reinvest) {
        currentBalance += interestEarned;
    }
    totalInterest += interestEarned;

    let contributionThisMonth = 0;
    if (periodicContribution > 0) {
        const isContributionMonth =
            contributionFrequency === 'mensal' ||
            (contributionFrequency === 'trimestral' && month % 3 === 0) ||
            (contributionFrequency === 'anual' && month % 12 === 0);

        if (isContributionMonth) {
            currentBalance += periodicContribution;
            totalInvested += periodicContribution;
            contributionThisMonth = periodicContribution;
        }
    }
    
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + month);
    const dateString = currentDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

    monthlyData.push({
      month,
      date: dateString,
      totalInvested,
      interest: interestEarned,
      totalInterest,
      balance: currentBalance,
    });
  }

  const finalGrossValue = currentBalance;
  const totalGains = finalGrossValue - totalInvested;
  const taxAmount = totalGains > 0 ? totalGains * (taxRate / 100) : 0;
  const finalNetValue = finalGrossValue - taxAmount;

  const totalInflationFactor = Math.pow(1 + inflation / 100, period / 12);
  const totalInvestedAdjusted = totalInvested * totalInflationFactor; // A simplified adjustment, more complex models exist
  const realGains = finalNetValue - totalInvestedAdjusted;

  return {
    monthlyData,
    totalInvested,
    totalInterest,
    finalGrossValue,
    finalNetValue,
    taxAmount,
    totalGains,
    realGains
  };
}

export { toBRL };
