import React, { useMemo } from 'react';
import Header from './Header';
import GaugeChart from './GaugeChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import HorizontalBarChart from './HorizontalBarChart';
import InsightCard from './InsightCard';
import RecommendationCard from './RecommendationCard';
import MetricCard from './MetricCard';
import { FinancialData, FinancialInsightResponse } from '@/types/api';
import { PnLData } from '@/types/pnlTypes';
import { 
  getSummaryData, 
  getCategoryData, 
  getExpensePercentages,
  getProfitMargins,
  getTopExpenses,
  formatCurrency,
  getIncomeBreakdown
} from '@/utils/chartDataUtils';
import { adaptFinancialDataToPnLData } from '@/utils/dataAdapters';

interface DashboardProps {
  financialData: FinancialData;
  insightData: FinancialInsightResponse;
}

/**
 * Main dashboard component with three-column layout
 * 
 * @param financialData - The financial data to display
 * @param insightData - The insight data to display
 */
const Dashboard: React.FC<DashboardProps> = ({ financialData, insightData }) => {
  // Convert FinancialData to PnLData for chart utilities
  const pnlData = useMemo(() => adaptFinancialDataToPnLData(financialData), [financialData]);
  
  // Prepare data for charts and metrics
  const summaryData = getSummaryData(pnlData);
  const categoryData = getCategoryData(pnlData);
  const expensePercentages = getExpensePercentages(pnlData);
  const margins = getProfitMargins(pnlData);
  const topExpenses = getTopExpenses(pnlData, 5);
  const incomeBreakdown = getIncomeBreakdown(pnlData);
  
  // Format expense categories for pie chart
  const expenseCategories = useMemo(() => {
    if (!financialData.sections.operatingExpenses) return [];
    
    // Ensure we have at least some data for testing
    if (financialData.sections.operatingExpenses.accounts.length === 0) {
      return [
        { category: 'Salaries & Wages', value: 250000, percentage: 45 },
        { category: 'Rent & Lease', value: 100000, percentage: 18 },
        { category: 'Marketing', value: 75000, percentage: 13.5 },
        { category: 'Travel', value: 50000, percentage: 9 },
        { category: 'Software', value: 40000, percentage: 7.2 },
        { category: 'Other', value: 40000, percentage: 7.3 }
      ];
    }
    
    // Process actual data if available
    return Array.from(
      financialData.sections.operatingExpenses.accounts.reduce((acc, account) => {
        const category = account.category || 'Other';
        if (!acc.has(category)) {
          acc.set(category, { 
            value: 0, 
            category: category 
          });
        }
        acc.get(category)!.value += Math.abs(account.value); // Use absolute value for expenses
        return acc;
      }, new Map<string, { value: number; category: string }>())
    ).map(([_, data]) => ({
      ...data,
      percentage: (data.value / Math.abs(financialData.sections.operatingExpenses.total)) * 100
    })).sort((a, b) => b.value - a.value);
  }, [financialData]);
  
  // Prepare mock trend data (this would be replaced with real data in a production app)
  const mockTrendData = [
    { name: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { name: 'Feb', revenue: 52000, expenses: 34000, profit: 18000 },
    { name: 'Mar', revenue: 49000, expenses: 31000, profit: 18000 },
    { name: 'Apr', revenue: 58000, expenses: 36000, profit: 22000 },
    { name: 'May', revenue: 55000, expenses: 35000, profit: 20000 },
    { name: 'Jun', revenue: 62000, expenses: 38000, profit: 24000 },
  ];
  
  const currency = financialData.metadata?.currency || 'USD';
  
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="w-full max-w-[2400px] mx-auto px-2 sm:px-4 py-6">
        <Header 
          companyName={financialData.companyName} 
          period={financialData.period} 
          basisType={financialData.basisType} 
          reportType={financialData.reportType} 
        />
        
        <div className="mt-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard 
              title="Income" 
              value={financialData.sections.tradingIncome.total} 
              subtitle="Total Revenue" 
              trend={3.8} 
              color="border-blue-500" 
            />
            <MetricCard 
              title="Cost of Sales" 
              value={financialData.sections.costOfSales?.total || 0} 
              subtitle="Direct Costs" 
              trend={-1.2} 
              color="border-amber-500" 
            />
            <MetricCard 
              title="Gross Profit" 
              value={financialData.sections.grossProfit} 
              subtitle="Revenue - COGS" 
              trend={4.5} 
              color="border-green-500" 
            />
            <MetricCard 
              title="Net Profit" 
              value={financialData.sections.netProfit} 
              subtitle="After All Expenses" 
              trend={5.2} 
              color="border-indigo-500" 
            />
          </div>
          
          {/* Main dashboard grid - Three-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left column - Financial Metrics */}
            <div className="lg:col-span-3 space-y-4 md:space-y-6">
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">Financial Health Metrics</h3>
                <div className="space-y-4 md:space-y-6">
                  {/* Card for Gross Profit Margin */}
                  <div className="bg-gray-50 rounded-lg shadow p-3 md:p-4">
                    <div className="text-center text-gray-700 mb-2">Gross Profit Margin</div>
                    <GaugeChart 
                      value={margins.grossMargin} 
                      color="#0066cc" 
                    />
                  </div>
                  
                  {/* Card for Net Profit Margin */}
                  <div className="bg-gray-50 rounded-lg shadow p-3 md:p-4">
                    <div className="text-center text-gray-700 mb-2">Net Profit Margin</div>
                    <GaugeChart 
                      value={margins.netMargin} 
                      color="#10b981" 
                    />
                  </div>

                  {/* Card for Operating Expense Ratio */}
                  <div className="bg-gray-50 rounded-lg shadow p-3 md:p-4">
                    <div className="text-center text-gray-700 mb-2">Operating Expense Ratio</div>
                    <GaugeChart 
                      value={margins.expenseRatio} 
                      color="#f97316" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">Top Expenses</h3>
                <div className="space-y-3 md:space-y-4">
                  {topExpenses.map((expense, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{expense.name.split(' - ')[1] || expense.name}</p>
                        <p className="text-xs text-gray-500">{expense.category}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.value, currency)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Middle column - Data Visualizations */}
            <div className="lg:col-span-5 space-y-4 md:space-y-6">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">Financial Trends & Breakdowns</h3>
                
                {/* Card for Monthly Financial Performance */}
                <div className="bg-gray-50 rounded-lg shadow p-3 md:p-4 mb-6">
                  <h4 className="text-md md:text-lg font-semibold text-gray-700 mb-3">Monthly Financial Performance</h4>
                  <LineChart 
                    data={mockTrendData} 
                    lines={[
                      { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
                      { key: 'expenses', color: '#ef4444', name: 'Expenses' },
                      { key: 'profit', color: '#10b981', name: 'Profit' }
                    ]}
                  />
                </div>

                {/* Card for Expense Categories */}
                <div className="bg-gray-50 rounded-lg shadow p-3 md:p-4 mb-6">
                  <h4 className="text-md md:text-lg font-semibold text-gray-700 mb-3">Expense Categories</h4>
                  <PieChart data={expenseCategories} />
                </div>

                {/* Card for Income Breakdown */}
                {incomeBreakdown && incomeBreakdown.length > 0 && (
                  <div className="bg-gray-50 rounded-lg shadow p-3 md:p-4">
                    <h4 className="text-md md:text-lg font-semibold text-gray-700 mb-3">Income Breakdown</h4>
                    <HorizontalBarChart data={incomeBreakdown} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - AI-Powered Insights */}
            <div className="lg:col-span-4 space-y-4 md:space-y-6">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">AI-Powered Insights</h3>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4 md:mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Financial Health Summary</h4>
                  <p className="text-sm text-gray-700">{insightData.summary}</p>
                </div>
                
                <h4 className="font-medium text-gray-800 mb-3 md:mb-4">Key Insights</h4>
                <div className="space-y-3 md:space-y-4">
                  {insightData.insights.map((insight, index) => (
                    <InsightCard key={index} insight={insight} />
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">Strategic Recommendations</h3>
                <div className="space-y-3 md:space-y-4">
                  {insightData.recommendations.map((recommendation, index) => (
                    <RecommendationCard key={index} recommendation={recommendation} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
