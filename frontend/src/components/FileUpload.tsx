/**
 * File upload component with drag-and-drop functionality.
 * Allows users to upload profit and loss Excel files.
 */

import React, { useState, useCallback, useRef } from 'react';
import { apiClient } from '../api/apiClient';
import { FinancialData } from '../types/api';

interface FileUploadProps {
  onUploadSuccess: (data: FinancialData) => void;
  onUploadError: (error: Error) => void;
}

/**
 * File upload component with drag-and-drop functionality.
 * 
 * @param onUploadSuccess - Callback function called when file upload is successful
 * @param onUploadError - Callback function called when file upload fails
 */
const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        onUploadError(new Error('Only Excel files (.xlsx, .xls) are supported'));
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(10); // Initial progress

        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + Math.random() * 20;
            return newProgress < 90 ? newProgress : 90;
          });
        }, 500);

        // Upload file to backend
        const data = await apiClient.uploadFile(file);
        
        // Clear interval and set progress to 100%
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Call success callback
        onUploadSuccess(data);
      } catch (error) {
        onUploadError(error instanceof Error ? error : new Error('Unknown error occurred'));
      } finally {
        setIsUploading(false);
        // Reset progress after a delay
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [onUploadSuccess, onUploadError]
  );

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      handleFileChange(files);
    },
    [handleFileChange]
  );

  // Handle button click
  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx,.xls"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg
            className={`w-12 h-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          
          <div className="text-lg font-medium">
            {isUploading ? 'Uploading...' : 'Drag & Drop your Excel file here'}
          </div>
          
          <div className="text-sm text-gray-500">
            {isUploading ? 'Please wait while we process your file' : 'or click to browse'}
          </div>
          
          <div className="text-xs text-gray-400">
            Supports Xero Profit & Loss Excel files (.xlsx, .xls)
          </div>
          
          {isUploading && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
