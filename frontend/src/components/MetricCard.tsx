
import React from 'react';

interface MetricCardProps {
  value: string;
  description: string;
  backgroundColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  value, 
  description, 
  backgroundColor = "#242254" 
}) => {
  return (
    <div 
      className="p-3 rounded-md"
      style={{ backgroundColor }}
    >
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-sm text-white">{description}</div>
    </div>
  );
};

export default MetricCard;
