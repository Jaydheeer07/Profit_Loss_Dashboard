/**
 * Utility functions and constants for styling components
 */

// Color mappings for different insight types
export const insightTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  'strength': { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700' },
  'warning': { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700' },
  'weakness': { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
  'opportunity': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' },
};

// Color mappings for impact levels
export const impactColors: Record<string, string> = {
  'high': 'bg-red-500',
  'medium': 'bg-yellow-500',
  'low': 'bg-green-500',
};

// Color mappings for difficulty levels
export const difficultyColors: Record<string, string> = {
  'easy': 'bg-green-500',
  'medium': 'bg-yellow-500',
  'hard': 'bg-red-500',
};

// Color mappings for timeframes
export const timeframeColors: Record<string, string> = {
  'short-term': 'bg-green-500',
  'medium-term': 'bg-yellow-500',
  'long-term': 'bg-red-500',
};

// Enhanced color palette for charts
export const chartColors = [
  '#6366f1', // indigo-500
  '#10b981', // emerald-500
  '#f97316', // orange-500
  '#8b5cf6', // violet-500
  '#3b82f6', // blue-500
  '#64748b', // slate-500
  '#ec4899', // pink-500
  '#22c55e', // green-500
  '#06b6d4', // cyan-500
  '#f59e0b', // amber-500
  '#7c3aed', // purple-600
  '#0284c7', // sky-600
  '#ef4444', // red-500
  '#0ea5e9', // sky-500
];

// Category-specific colors
export const categoryColors: Record<string, string> = {
  'Salaries & Wages': '#6366f1', // indigo-500
  'Rent & Lease': '#10b981', // emerald-500
  'Marketing': '#f97316', // orange-500
  'Travel': '#8b5cf6', // violet-500
  'Accounting': '#3b82f6', // blue-500
  'Other Expenses': '#64748b', // slate-500
  'Bank Charges': '#ec4899', // pink-500
  'Donations': '#22c55e', // green-500
  'Telecommunications': '#06b6d4', // cyan-500
  'Subscriptions': '#f59e0b', // amber-500
  'Training & Development': '#7c3aed', // purple-600
  'Software': '#0284c7', // sky-600
  'Direct Costs': '#ef4444', // red-500
  'Sales': '#0ea5e9', // sky-500
};

/**
 * Get a color for a category, with fallback to a default color
 * 
 * @param category - The category to get a color for
 * @param index - Optional index for fallback color
 * @returns The color for the category
 */
export const getCategoryColor = (category: string, index: number = 0): string => {
  return categoryColors[category] || chartColors[index % chartColors.length];
};

/**
 * Format a value as currency
 * 
 * @param value - The value to format
 * @param currency - The currency code (default: USD)
 * @param options - Options for formatting
 * @returns The formatted currency string
 */
export const formatCurrency = (
  value: number, 
  currency: string = 'USD',
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    compactDisplay?: 'short' | 'long';
  }
): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    notation = 'standard',
    compactDisplay = 'short',
  } = options || {};

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
    ...(notation === 'compact' ? { compactDisplay } : {}),
  }).format(value);
};

/**
 * Format a value as percentage
 * 
 * @param value - The value to format (0-100)
 * @param minimumFractionDigits - Minimum fraction digits (default: 1)
 * @param maximumFractionDigits - Maximum fraction digits (default: 1)
 * @returns The formatted percentage string
 */
export const formatPercentage = (
  value: number,
  minimumFractionDigits: number = 1,
  maximumFractionDigits: number = 1
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100);
};
