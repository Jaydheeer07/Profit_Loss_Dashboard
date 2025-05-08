import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { chartColors, getCategoryColor, formatCurrency, formatPercentage } from '@/utils/styleUtils';

interface DataPoint {
  category: string;
  value: number;
  percentage?: number;
}

interface PieChartProps {
  data: DataPoint[];
  title?: string;
}

// Custom legend that displays colored boxes with category names and percentages
const CustomLegend = (props: any) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pl-4 w-full">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center justify-between">
          <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
            <div
              className="w-3 h-3 mr-2 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-base font-medium text-gray-700 truncate">
              {entry.value} {/* This is the category name from Recharts payload */}
            </span>
          </div>
          <span className="ml-3 text-base font-medium text-gray-800 flex-shrink-0">
            {entry.payload && typeof entry.payload.percentage === 'number'
              ? `${entry.payload.percentage.toFixed(1)}%`
              : formatPercentage(0)}{/* Use formatPercentage for consistency */}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Enhanced pie chart component with better color differentiation and top N legend
 * 
 * @param data - Array of data points to display
 * @param title - Chart title
 */
const PieChart: React.FC<PieChartProps> = ({ data: initialData, title }) => {
  
  // Calculate total value for percentage calculation
  const totalValue = initialData.reduce((sum, item) => sum + item.value, 0);

  // Add percentages to data, sort, and take top 6 if more exist
  let chartData = initialData.map(item => ({
    ...item,
    percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
  })).sort((a, b) => b.value - a.value);

  if (chartData.length > 6) {
    chartData = chartData.slice(0, 6); // Take the top 6 categories
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium text-gray-800">{data.category}</p>
          <p className="text-gray-600">{formatCurrency(data.value)}</p>
          <p className="text-gray-600">{formatPercentage(data.percentage || 0)}</p>
        </div>
      );
    }
    return null;
  };
  
  // Custom label for pie chart slices
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Only show label if percentage is significant enough
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <div className="h-64 md:h-72 lg:h-80 w-full min-h-[300px] flex flex-col items-center">
        <ResponsiveContainer width="100%" height="70%"> 
          <RechartsPieChart>
            <>
              <Pie
                data={chartData} // Use chartData (top 6 or less)
                cx="50%" 
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="80%" 
                innerRadius="0%" 
                fill="#8884d8"
                dataKey="value"
                nameKey="category" 
              >
                <>
                  {chartData.map((entry, index) => ( // Use chartData
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category, index)} />
                  ))}
                </>
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </>
          </RechartsPieChart>
        </ResponsiveContainer>
        {/* Render CustomLegend directly for more layout control if Recharts Legend wrapper is restrictive */}
        <div className="w-full mt-4 px-2">
          <CustomLegend payload={chartData.map((item, index) => ({ // Use chartData
            value: item.category, // category name for display
            color: getCategoryColor(item.category, index),
            payload: item, // original data item (with percentage)
          }))} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
