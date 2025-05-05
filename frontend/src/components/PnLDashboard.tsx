import React from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import MetricCard from '@/components/MetricCard';
import GaugeChart from '@/components/GaugeChart';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#4053b5', '#43b8ea', '#74e455', '#c2a736', '#a854f7', '#FF8042', '#1c1188', '#6f58bc'];

interface PnLDashboardProps {
  data: PnLData;
}

const PnLDashboard: React.FC<PnLDashboardProps> = ({ data }) => {
  const summaryData = getSummaryData(data);
  const categoryData = getCategoryData(data);
  const expensePercentages = getExpensePercentages(data);
  const margins = getProfitMargins(data);
  const topExpenses = getTopExpenses(data, 5);
  const incomeBreakdown = getIncomeBreakdown(data);
  
  const currency = data.metadata.currency;

  return (
    <div className="space-y-6">
      {/* Header with company info */}
      <Card className="bg-[#1b184a] border-0">
        <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <TrendingUp className="h-5 w-5 mr-2" />
            {data.companyName} - Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-sm text-white mb-4">
            {data.period} | {data.basisType} Basis | {data.reportType} Report
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {summaryData.map((item, index) => (
              <MetricCard 
                key={index} 
                value={item.formattedValue} 
                description={item.label}
                backgroundColor={item.color}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Main dashboard content - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Income Breakdown */}
          <Card className="bg-[#1b184a] border-0">
            <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="h-5 w-5 mr-2" />
                Income Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333357" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#fff' }} 
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#242254] p-2 border border-[#333357] rounded text-white">
                              <p className="label">{`${label}`}</p>
                              <p className="value">{formatCurrency(payload[0].value as number, currency)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#43b8ea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Profit Margins */}
          <Card className="bg-[#1b184a] border-0">
            <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="h-5 w-5 mr-2" />
                Profit Margins
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-center text-white mb-2">Gross Profit Margin</div>
                  <GaugeChart value={margins.grossMargin} label={`${margins.grossMargin}%`} color="#74e455" />
                </div>
                <div>
                  <div className="text-center text-white mb-2">Net Profit Margin</div>
                  <GaugeChart value={margins.netMargin} label={`${margins.netMargin}%`} color="#4053b5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Expense Categories */}
          <Card className="bg-[#1b184a] border-0">
            <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingDown className="h-5 w-5 mr-2" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number, currency)}
                        contentStyle={{ backgroundColor: '#242254', color: 'white', border: 'none' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-3">Top Categories</h3>
                  <ul className="space-y-2">
                    {expensePercentages.slice(0, 5).map((item, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                        <span>{item.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Expenses */}
          <Card className="bg-[#1b184a] border-0">
            <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingDown className="h-5 w-5 mr-2" />
                Top Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {topExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between text-white mb-1">
                        <span>{expense.name.split(' - ')[1] || expense.name}</span>
                        <span>{formatCurrency(expense.value, currency)}</span>
                      </div>
                      <div className="w-full bg-[#242254] h-2 rounded-full">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${Math.min(100, Math.abs(expense.value / topExpenses[0].value * 100))}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PnLDashboard;
