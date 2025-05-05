
import { PnLData, PnLAccount } from "../types/pnlTypes";

// Aggregates expenses by category
export const getCategoryData = (data: PnLData) => {
  const categories: Record<string, number> = {};
  
  // Process operating expenses
  data.sections.operatingExpenses.accounts.forEach(account => {
    if (!categories[account.category]) {
      categories[account.category] = 0;
    }
    categories[account.category] += account.value;
  });
  
  // Create array for pie chart
  return Object.entries(categories).map(([name, value]) => ({
    name,
    value: Math.abs(value), // Use absolute value for visualization
  }));
};

// Get summary data for the main metrics
export const getSummaryData = (data: PnLData) => {
  const currency = data.metadata.currency;
  
  return [
    { 
      label: "Income", 
      value: data.sections.tradingIncome.total,
      color: "#43b8ea" 
    },
    { 
      label: "Cost of Sales", 
      value: data.sections.costOfSales.total,
      color: "#c2a736" 
    },
    { 
      label: "Gross Profit", 
      value: data.sections.grossProfit,
      color: "#74e455" 
    },
    { 
      label: "Operating Expenses", 
      value: data.sections.operatingExpenses.total,
      color: "#a854f7" 
    },
    { 
      label: "Net Profit", 
      value: data.sections.netProfit,
      color: "#4053b5" 
    }
  ].map(item => ({
    ...item,
    formattedValue: formatCurrency(item.value, currency)
  }));
};

// Format currency values
export const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Calculate percentages for expense categories
export const getExpensePercentages = (data: PnLData) => {
  const totalExpenses = data.sections.operatingExpenses.total;
  const categories = getCategoryData(data);
  
  return categories.map(category => ({
    name: category.name,
    percentage: Math.round((category.value / totalExpenses) * 100),
    value: category.value
  }));
};

// Get profit margins
export const getProfitMargins = (data: PnLData) => {
  const totalIncome = data.sections.tradingIncome.total;
  const grossProfit = data.sections.grossProfit;
  const netProfit = data.sections.netProfit;
  
  return {
    grossMargin: Math.round((grossProfit / totalIncome) * 100),
    netMargin: Math.round((netProfit / totalIncome) * 100)
  };
};

// Get top expenses (absolute value, descending order)
export const getTopExpenses = (data: PnLData, limit: number = 5): PnLAccount[] => {
  return [...data.sections.operatingExpenses.accounts]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, limit);
};

// Prepare data for income breakdown chart
export const getIncomeBreakdown = (data: PnLData) => {
  return data.sections.tradingIncome.accounts.map(account => ({
    name: account.name.split(' - ')[1] || account.name,
    value: account.value
  }));
};
