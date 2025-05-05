/**
 * Custom hook for handling file uploads.
 * Provides state and handlers for uploading files and processing the results.
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { FinancialData, MetricsResponse } from '../types/api';

interface UseFileUploadReturn {
  isUploading: boolean;
  uploadError: Error | null;
  financialData: FinancialData | null;
  metricsData: MetricsResponse | null;
  handleFileUpload: (file: File) => Promise<FinancialData>;
  setMetricsData: (data: MetricsResponse) => void;
  resetUploadState: () => void;
}

/**
 * Custom hook for handling file uploads and processing.
 * 
 * @returns Object with upload state and handlers
 */
export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsResponse | null>(null);

  /**
   * Handle file upload and process the results.
   * 
   * @param file - The file to upload
   */
  const handleFileUpload = useCallback(async (file: File) => {
    console.log('File upload started:', file.name);
    try {
      setIsUploading(true);
      setUploadError(null);
      
      // Step 1: Upload the file and get financial data
      console.log('Calling API to upload file...');
      const data = await apiClient.uploadFile(file);
      console.log('File upload successful, received data:', data);
      setFinancialData(data);
      
      // Step 2: Calculate metrics from the financial data
      console.log('Calling API to calculate metrics...');
      const metrics = await apiClient.getMetrics(data);
      console.log('Metrics calculation successful:', metrics);
      setMetricsData(metrics);
      
      return data;
    } catch (error) {
      console.error('Error in file upload process:', error);
      const err = error instanceof Error ? error : new Error('Unknown error occurred');
      setUploadError(err);
      throw err;
    } finally {
      setIsUploading(false);
      console.log('File upload process completed');
    }
  }, []);

  /**
   * Reset the upload state.
   */
  const resetUploadState = useCallback(() => {
    setIsUploading(false);
    setUploadError(null);
    setFinancialData(null);
    setMetricsData(null);
  }, []);

  /**
   * Set metrics data manually.
   * 
   * @param data - The metrics data to set
   */
  const setMetricsDataManually = useCallback((data: MetricsResponse) => {
    console.log('Setting metrics data manually:', data);
    setMetricsData(data);
  }, []);

  return {
    isUploading,
    uploadError,
    financialData,
    metricsData,
    handleFileUpload,
    setMetricsData: setMetricsDataManually,
    resetUploadState,
  };
};

export default useFileUpload;
