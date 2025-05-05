/**
 * Main dashboard page that integrates file upload and displays the P&L dashboard.
 * This component connects the frontend to the backend API.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '../hooks/useFileUpload';
import { useInsights } from '../hooks/useInsights';
import { apiClient } from '../api/apiClient';
import FileUpload from '../components/FileUpload';
import { FinancialData, MetricsResponse } from '../types/api';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Main dashboard page component.
 */
const Dashboard: React.FC = () => {
  // State for tracking the current step in the workflow
  const [currentStep, setCurrentStep] = useState<'upload' | 'metrics' | 'insights' | 'dashboard'>('upload');
  
  // Custom hooks for file upload and insights
  const { 
    isUploading, 
    uploadError, 
    financialData, 
    metricsData, 
    handleFileUpload, 
    setMetricsData,
    resetUploadState 
  } = useFileUpload();
  
  const { 
    isLoading: isLoadingInsights, 
    error: insightsError, 
    insights, 
    generateInsights 
  } = useInsights();

  // Handle successful file upload
  const handleUploadSuccess = async (data: FinancialData) => {
    console.log('File upload successful, data:', data);
    setCurrentStep('metrics');
    
    try {
      // Explicitly calculate metrics after successful upload
      console.log('Explicitly calculating metrics for the uploaded data');
      const metrics = await apiClient.getMetrics(data);
      console.log('Metrics calculated successfully:', metrics);
      
      // Manually set the metrics data
      setMetricsData(metrics);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  // Handle file upload error
  const handleUploadError = (error: Error) => {
    console.error('File upload error:', error);
  };

  // Use navigate for redirection
  const navigate = useNavigate();

  // Generate insights from metrics data
  const handleGenerateInsights = async () => {
    console.log('Generate Insights button clicked');
    console.log('Metrics data available:', !!metricsData);
    
    // If metrics data is not available but we have financial data, calculate metrics first
    if (!metricsData && financialData) {
      console.log('No metrics data available, but financial data exists. Calculating metrics now...');
      try {
        const metrics = await apiClient.getMetrics(financialData);
        console.log('Metrics calculated on-demand:', metrics);
        setMetricsData(metrics);
        // Continue with the newly calculated metrics
      } catch (error) {
        console.error('Failed to calculate metrics:', error);
        return;
      }
    } else if (!metricsData && !financialData) {
      console.error('No financial data or metrics data available. Cannot generate insights.');
      return;
    }
    
    setCurrentStep('insights');
    console.log('Setting current step to insights');
    
    try {
      console.log('Calling generateInsights with metrics data:', metricsData);
      const insightsData = await generateInsights(metricsData);
      console.log('Insights generated successfully:', insightsData);
      
      // Store the data in localStorage to be used by PnLDemo
      // We need to use metricsData.financialData since that's guaranteed to be available
      console.log('Creating combined data from metrics and insights');
      
      // Extract financial data from metrics data
      const financialDataToUse = metricsData?.financialData || financialData;
      
      if (financialDataToUse) {
        console.log('Financial data available, creating combined data');
        const combinedData = {
          ...financialDataToUse,
          insights: insightsData
        };
        
        // Store the data in localStorage
        console.log('Storing data in localStorage');
        localStorage.setItem('pnlData', JSON.stringify(combinedData));
        
        // Redirect to the PnLDemo page
        console.log('Redirecting to PnLDemo page');
        navigate('/pnl-demo');
      } else {
        console.error('No financial data available in either financialData or metricsData');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

  // Reset the workflow and start over
  const handleReset = () => {
    resetUploadState();
    setCurrentStep('upload');
  };

  // Render error alert if there's an error
  const renderError = (error: Error | null, title: string) => {
    if (!error) return null;
    
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  };

  // Render loading state
  const renderLoading = (message: string) => {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    );
  };

  // Render the appropriate content based on the current step
  const renderContent = () => {
    // Show upload errors
    if (uploadError) {
      return renderError(uploadError, 'File Upload Error');
    }
    
    // Show insights errors
    if (insightsError) {
      return renderError(insightsError, 'Insights Generation Error');
    }
    
    // Show loading states
    if (isUploading) {
      return renderLoading('Uploading and processing your file...');
    }
    
    if (isLoadingInsights) {
      return renderLoading('Generating financial insights...');
    }
    
    // Show the appropriate step
    switch (currentStep) {
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Upload Your Profit & Loss Report</h1>
            <p className="text-center mb-8 text-gray-600">
              Upload your Xero Profit & Loss Excel file to generate insights and visualizations.
            </p>
            <FileUpload 
              onUploadSuccess={handleUploadSuccess} 
              onUploadError={handleUploadError} 
            />
          </div>
        );
        
      case 'metrics':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Financial Data Processed</h1>
            <p className="text-center mb-8 text-gray-600">
              Your financial data has been successfully processed. Would you like to generate insights?
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleGenerateInsights}>Generate Insights</Button>
              <Button variant="outline" onClick={handleReset}>Upload Another File</Button>
            </div>
          </div>
        );
        
      case 'insights':
        return renderLoading('Generating financial insights...');
        
      case 'dashboard':
        // We no longer render the dashboard here since we redirect to PnLDemo
        return renderLoading('Redirecting to dashboard...');
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
    </div>
  );
};

export default Dashboard;
