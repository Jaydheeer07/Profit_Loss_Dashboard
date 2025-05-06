/**
 * Enhanced file upload component with drag-and-drop functionality.
 * Integrated with the existing API client for the Profit & Loss Dashboard.
 */

import { useState, useCallback } from 'react';
import { CloudUpload, Info, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/api/apiClient';
import { FinancialData, MetricsResponse, InsightRequest } from '@/types/api';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState<'idle' | 'uploading' | 'metrics' | 'insights'>('idle');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a file in .xlsx, .xls, or .csv format",
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
  };

  const processFile = useCallback(async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Step 1: Upload file
      setProcessingStep('uploading');
      setUploadProgress(10);
      
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress < 30 ? newProgress : 30;
        });
      }, 300);
      
      console.log('Uploading file to API...');
      const fileData = await apiClient.uploadFile(file);
      clearInterval(progressInterval);
      setUploadProgress(33);
      
      // Step 2: Calculate metrics
      setProcessingStep('metrics');
      setUploadProgress(40);
      
      // Simulate progress for metrics calculation
      const metricsInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress < 60 ? newProgress : 60;
        });
      }, 300);
      
      console.log('Calculating financial metrics...');
      const metricsData = await apiClient.getMetrics(fileData);
      clearInterval(metricsInterval);
      setUploadProgress(66);
      
      // Step 3: Generate insights
      setProcessingStep('insights');
      setUploadProgress(70);
      
      // Simulate progress for insights generation
      const insightsInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress < 90 ? newProgress : 90;
        });
      }, 300);
      
      console.log('Generating financial insights...');
      const insightRequest: InsightRequest = {
        companyName: fileData.companyName || 'Your Company',
        period: fileData.period || 'Current Period',
        financialData: fileData
      };
      
      const insightsData = await apiClient.generateInsights(insightRequest);
      clearInterval(insightsInterval);
      setUploadProgress(100);
      
      // Store data in localStorage for dashboard access
      localStorage.setItem('financialData', JSON.stringify(fileData));
      localStorage.setItem('metricsData', JSON.stringify(metricsData));
      localStorage.setItem('insightsData', JSON.stringify(insightsData));
      
      toast({
        title: "Analysis complete!",
        description: "Your financial data has been processed successfully.",
      });
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setProcessingStep('idle');
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, [file, toast, navigate]);

  const getStepLabel = () => {
    switch (processingStep) {
      case 'uploading':
        return 'Uploading your file...';
      case 'metrics':
        return 'Calculating financial metrics...';
      case 'insights':
        return 'Generating AI-powered insights...';
      default:
        return 'Processing...';
    }
  };

  return (
    <section id="upload-section" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-navy">
            Upload Your Financial Data
          </h2>
          
          <div 
            className={`border-2 border-dashed ${isDragging ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'} 
            ${!file && !isUploading ? 'hover:border-blue-400' : ''} 
            rounded-lg p-8 text-center cursor-pointer transition-all duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && !isUploading && document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileInput}
            />
            
            {!file && !isUploading ? (
              <div>
                <CloudUpload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Drag & Drop Your Excel File Here
                </h3>
                <p className="text-gray-500 text-sm mb-2">or click to browse</p>
                <p className="text-gray-400 text-xs">
                  Supports Xero Profit & Loss Excel files (.xlsx, .xls, .csv)
                </p>
              </div>
            ) : isUploading ? (
              <div>
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">{getStepLabel()}</p>
                <div className="w-full mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={(e) => {
                    e.stopPropagation();
                    processFile();
                  }}
                >
                  Process File
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-center text-gray-600 text-sm">
            <Info className="h-4 w-4 mr-2" />
            <span>
              For best results, use our standardized template format for data upload
            </span>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="/sample-profit-loss.xlsx" 
              className="text-blue-600 hover:text-blue-800 text-sm underline"
              download
            >
              Download Sample Template
            </a>
            <p className="text-xs text-gray-500 mt-1">
              Use this template to format your profit & loss data for best results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
