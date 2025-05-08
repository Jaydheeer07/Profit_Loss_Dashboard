import { FinancialData } from '@/types/api';
import { PnLData } from '@/types/pnlTypes';

/**
 * Adapts FinancialData from the API to PnLData format for chart utilities
 * 
 * @param data - The financial data from the API
 * @returns The data in PnLData format
 */
export const adaptFinancialDataToPnLData = (data: FinancialData): PnLData => {
  return {
    companyName: data.companyName,
    period: data.period,
    basisType: data.basisType,
    reportType: data.reportType,
    sections: {
      tradingIncome: {
        accounts: data.sections.tradingIncome.accounts.map(account => ({
          ...account,
          category: account.category || 'Uncategorized' // Ensure category is always present
        })),
        total: data.sections.tradingIncome.total
      },
      costOfSales: data.sections.costOfSales ? {
        accounts: data.sections.costOfSales.accounts.map(account => ({
          ...account,
          category: account.category || 'Cost of Sales'
        })),
        total: data.sections.costOfSales.total
      } : {
        accounts: [],
        total: 0
      },
      grossProfit: data.sections.grossProfit,
      operatingExpenses: {
        accounts: data.sections.operatingExpenses.accounts.map(account => ({
          ...account,
          category: account.category || 'Operating Expenses'
        })),
        total: data.sections.operatingExpenses.total
      },
      netProfit: data.sections.netProfit
    },
    metadata: data.metadata
  };
};
