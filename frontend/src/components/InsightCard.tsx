import React from 'react';
import { FinancialInsight } from '@/types/api';
import { insightTypeColors, impactColors } from '@/utils/styleUtils';

interface InsightCardProps {
  insight: FinancialInsight;
}

/**
 * Displays a color-coded insight card with impact badge
 * 
 * @param insight - The financial insight to display
 */
const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const { type, title, description, metrics, impact } = insight;
  const colors = insightTypeColors[type] || insightTypeColors['opportunity']; // Default to opportunity if type not found
  
  const getTypeIcon = () => {
    switch (type) {
      case 'strength':
        return '↗️';
      case 'weakness':
        return '↘️';
      case 'opportunity':
        return '💡';
      case 'warning':
        return '⚠️';
      default:
        return '📊';
    }
  };
  
  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4 mb-4 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start">
        <div className="text-xl mr-3">{getTypeIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${colors.text}`}>{title}</h4>
            <span className={`text-xs font-bold text-white px-2 py-1 rounded-full ${impactColors[impact] || 'bg-gray-500'}`}>
              {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-1">
            {metrics.map((metric, index) => (
              <span 
                key={index} 
                className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
