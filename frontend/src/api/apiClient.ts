/**
 * API client for communicating with the backend.
 * Provides methods for uploading files, fetching metrics, and generating insights.
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FinancialData, MetricsResponse, InsightRequest, FinancialInsightResponse, ChatRequest } from '@/types/api';

// Base URL for API requests - can be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging and handling common request tasks
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and handling common response tasks
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log errors and handle common error scenarios
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * API client for the Profit & Loss Dashboard.
 */
export const apiClient = {
  /**
   * Upload a profit and loss Excel file.
   * 
   * @param file - The Excel file to upload
   * @returns Promise with the parsed financial data
   */
  uploadFile: async (file: File): Promise<FinancialData> => {
    console.log('API Client: Uploading file', file.name);
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      console.log('API Client: Sending POST request to /api/upload/');
      const response: AxiosResponse<FinancialData> = await axiosInstance.post(
        '/api/upload/',
        formData,
        config
      );
      console.log('API Client: Upload successful, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Client: Upload failed:', error);
      throw error;
    }
  },

  /**
   * Calculate financial metrics from financial data.
   * 
   * @param data - The financial data from the uploaded profit and loss report
   * @returns Promise with the metrics response
   */
  getMetrics: async (data: FinancialData): Promise<MetricsResponse> => {
    console.log('API Client: Getting metrics for financial data');
    try {
      console.log('API Client: Sending POST request to /api/analyzer/metrics/');
      const response: AxiosResponse<MetricsResponse> = await axiosInstance.post(
        '/api/analyzer/metrics/',
        data
      );
      console.log('API Client: Metrics calculation successful, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Client: Metrics calculation failed:', error);
      throw error;
    }
  },

  /**
   * Generate financial insights using LLM based on uploaded financial data.
   * 
   * @param data - The insight request containing company name, period, and financial data
   * @returns Promise with the financial insights and recommendations
   */
  generateInsights: async (data: InsightRequest): Promise<FinancialInsightResponse> => {
    console.log('API Client: Generating insights for data', data);
    try {
      console.log('API Client: Sending POST request to /api/insights/insights/');
      const response: AxiosResponse<FinancialInsightResponse> = await axiosInstance.post(
        '/api/insights/insights/',
        data
      );
      console.log('API Client: Insights generation successful, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Client: Insights generation failed:', error);
      throw error;
    }
  },

  /**
   * Chat with the LLM about financial data.
   * 
   * @param query - The question or prompt to send to the LLM
   * @returns Promise with the chat response
   */
  chat: async (query: string): Promise<{ message: string; model: string }> => {
    const request: ChatRequest = { query };
    const response = await axiosInstance.post('/api/insights/chat/', request);
    return response.data;
  },

  /**
   * Export financial data to JSON format.
   * 
   * @param data - The financial data to export
   * @returns Promise with the JSON blob
   */
  exportToJson: async (data: FinancialData): Promise<Blob> => {
    const response = await axiosInstance.post('/api/export/json/', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export financial data to CSV format.
   * 
   * @param data - The financial data to export
   * @returns Promise with the CSV blob
   */
  exportToCsv: async (data: FinancialData): Promise<Blob> => {
    const response = await axiosInstance.post('/api/export/csv/', data, {
      responseType: 'blob',
    });
    return response.data;
  },
};
