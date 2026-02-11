import { ROI } from '../value-objects/ROI';

export interface LotFinancialAnalysis {
  totalCosts: number;
  costsByCategory: Record<string, number>;
  totalIncome: number;
  grossMargin: number;
  roi: ROI;
  costPerKgGained: number;
}

export interface ProfitabilityDashboard {
  totalIncome: number;
  totalExpenses: number;
  grossMargin: number;
  lotProfitability: Array<{ lotId: string; lotCode: string; margin: number }>;
}

export class LotFinancialAnalyzerService {
  calculateROI(totalInvestment: number, totalRevenue: number): ROI {
    return ROI.fromValues(totalInvestment, totalRevenue);
  }

  calculateCostPerKgGained(totalCost: number, totalKgGained: number): number {
    if (totalKgGained === 0) return 0;
    return Math.round((totalCost / totalKgGained) * 100) / 100;
  }

  calculateGrossMargin(totalIncome: number, totalExpenses: number): number {
    return Math.round((totalIncome - totalExpenses) * 100) / 100;
  }
}
