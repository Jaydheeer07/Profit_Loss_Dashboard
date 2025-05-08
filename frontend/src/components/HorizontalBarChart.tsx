import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/utils/styleUtils'; // Assuming you have this or similar
import { getCategoryColor } from '@/utils/styleUtils'; // For consistent coloring

interface DataPoint {
  name: string;
  value: number;
}

interface HorizontalBarChartProps {
  data: DataPoint[];
  title?: string;
}

// Custom Tooltip for Bar Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 shadow-lg rounded-md">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-blue-600">
          {`Value: ${formatCurrency(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data: initialData, title }) => {
  // Sort data by value in descending order for better visualization
  const sortedData = [...initialData].sort((a, b) => b.value - a.value).slice(0, 10); // Show top 10 or fewer

  if (!sortedData || sortedData.length === 0) {
    return (
      <div className="w-full">
        {title && (
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">{title}</h3>
        )}
        <div className="h-[300px] md:h-[350px] w-full flex items-center justify-center">
          <p className="text-gray-500">No data available to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">{title}</h3>
      )}
      <div className="h-[300px] md:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 100, // Increased left margin for longer labels
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => formatCurrency(value, undefined, { notation: 'compact' })} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150} // Adjust width for labels
              tick={{ fontSize: 12 }} 
              interval={0} // Show all labels
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }} />
            <Bar dataKey="value" barSize={20}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name, index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HorizontalBarChart;
