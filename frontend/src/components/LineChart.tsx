import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { chartColors, formatCurrency } from '@/utils/styleUtils';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  lines?: {
    key: string;
    color: string;
    name?: string;
  }[];
}

/**
 * Line chart component for visualizing trends over time
 * 
 * @param data - Array of data points to display
 * @param title - Chart title
 * @param lines - Configuration for lines to display (key, color, name)
 */
const LineChart: React.FC<LineChartProps> = ({ data, title, lines = [] }) => {
  // If no lines are specified but data has properties, create default lines
  const chartLines = lines.length > 0 ? lines : 
    Object.keys(data[0] || {})
      .filter(key => key !== 'name')
      .map((key, index) => ({
        key,
        color: getDefaultColor(index),
        name: key
      }));
  
  // Default colors for lines if not specified
  function getDefaultColor(index: number): string {
    return chartColors[index % chartColors.length];
  }
  
  // Format numbers for tooltip
  const formatValue = (value: number): string => {
    return formatCurrency(value);
  };
  
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      <div className="h-72 md:h-80 lg:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#6b7280' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#6b7280' }}
              tickFormatter={(value) => formatValue(value)}
            />
            <Tooltip 
              formatter={(value) => [formatValue(value as number), '']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend />
            {chartLines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.key}
                name={line.name || line.key}
                stroke={line.color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
