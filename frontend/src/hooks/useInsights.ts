/**
 * Custom hook for handling financial insights.
 * Provides state and handlers for generating and managing insights.
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { MetricsResponse, FinancialInsightResponse } from '../types/api';

interface UseInsightsReturn {
  isLoading: boolean;
  error: Error | null;
  insights: FinancialInsightResponse | null;
  generateInsights: (metricsData: MetricsResponse) => Promise<FinancialInsightResponse>;
  resetInsights: () => void;
  chatWithLLM: (query: string) => Promise<{ message: string; model: string }>;
}

/**
 * Custom hook for handling financial insights generation.
 * 
 * @returns Object with insights state and handlers
 */
export const useInsights = (): UseInsightsReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [insights, setInsights] = useState<FinancialInsightResponse | null>(null);

  /**
   * Generate financial insights based on metrics data.
   * 
   * @param metricsData - The metrics data to generate insights from
   */
  const generateInsights = useCallback(async (metricsData: MetricsResponse) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate insights using the metrics data
      const insightsResponse = await apiClient.generateInsights(metricsData);
      setInsights(insightsResponse);
      
      return insightsResponse;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error occurred');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Chat with the LLM about financial data.
   * 
   * @param query - The question or prompt to send to the LLM
   * @returns The chat response
   */
  const chatWithLLM = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      
      // Send chat query to the LLM
      const response = await apiClient.chat(query);
      
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error occurred');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset the insights state.
   */
  const resetInsights = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setInsights(null);
  }, []);

  return {
    isLoading,
    error,
    insights,
    generateInsights,
    resetInsights,
    chatWithLLM,
  };
};

export default useInsights;
