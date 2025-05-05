
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  max = 100, 
  label, 
  color = '#74e455' 
}) => {
  // Calculate the percentage for the gauge
  const percentage = (value / max) * 100;
  
  // Create data for the gauge (active part and inactive part)
  const data = [
    { name: 'active', value: percentage },
    { name: 'inactive', value: 100 - percentage }
  ];

  // Semi-circle pie chart configuration
  const startAngle = 180;
  const endAngle = 0;
  
  return (
    <div className="relative">
      <div className="h-[100px]">
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
              <Cell key="inactive" fill="#2c2964" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {label && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-gray-300">
          {label}
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
