import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  trend?: number;
  color?: string;
  formatValue?: (value: number) => string;
}

/**
 * Enhanced metric card component with trend indicator
 * 
 * @param title - The title of the metric
 * @param value - The value of the metric
 * @param subtitle - Optional subtitle for additional context
 * @param trend - Optional trend value (percentage change)
 * @param color - Optional border color
 * @param formatValue - Optional function to format the value
 */
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  color = 'border-blue-500',
  formatValue = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{formatValue(value)}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            <span className="ml-1">{trend >= 0 ? '↑' : '↓'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
