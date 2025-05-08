import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  max?: number;
  color?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  max = 100, 
  color = '#74e455' 
}) => {
  // Calculate the percentage for the gauge
  const percentage = (value / max) * 100;
  const displayValue = percentage.toFixed(1); // Value to display, e.g., "93.0"
  
  // Create data for the gauge (active part and inactive part)
  const data = [
    { name: 'active', value: percentage },
    { name: 'inactive', value: 100 - percentage }
  ];

  // Semi-circle pie chart configuration
  const startAngle = 180;
  const endAngle = 0;
  
  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="h-[70px] w-[140px] relative"> 
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={40}
              outerRadius={60}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell key="active" fill={color} />
              <Cell key="inactive" fill="#E5E7EB" /> 
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span 
            className="text-xl font-semibold text-gray-700" 
            style={{ transform: 'translateY(10px)' }} 
          >
            {displayValue}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
