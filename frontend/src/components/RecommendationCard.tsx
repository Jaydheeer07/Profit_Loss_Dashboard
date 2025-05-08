import React from 'react';
import { FinancialRecommendation } from '@/types/api';
import { impactColors, difficultyColors, timeframeColors } from '@/utils/styleUtils';

interface RecommendationCardProps {
  recommendation: FinancialRecommendation;
}

/**
 * Displays a recommendation card with impact, difficulty, and timeframe badges
 * 
 * @param recommendation - The financial recommendation to display
 */
const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { title, description, expected_impact, implementation_difficulty, timeframe } = recommendation;
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 transition-all duration-300 hover:shadow-md">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      <div className="flex flex-wrap gap-2">
        <span className={`text-xs text-white px-2 py-1 rounded-full ${impactColors[expected_impact] || 'bg-gray-500'}`}>
          {expected_impact.charAt(0).toUpperCase() + expected_impact.slice(1)} Impact
        </span>
        <span className={`text-xs text-white px-2 py-1 rounded-full ${difficultyColors[implementation_difficulty] || 'bg-gray-500'}`}>
          {implementation_difficulty.charAt(0).toUpperCase() + implementation_difficulty.slice(1)} Difficulty
        </span>
        <span className={`text-xs text-white px-2 py-1 rounded-full ${timeframeColors[timeframe] || 'bg-gray-500'}`}>
          {timeframe.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </div>
    </div>
  );
};

export default RecommendationCard;
