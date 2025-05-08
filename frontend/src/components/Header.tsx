import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Download, FileText } from 'lucide-react';

interface HeaderProps {
  companyName: string;
  period: string;
  basisType: string;
  reportType: string;
}

/**
 * Header component for the dashboard, styled to match the new design.
 * 
 * @param companyName - The name of the company
 * @param period - The reporting period
 * @param basisType - The basis type (e.g., Accrual, Cash)
 * @param reportType - The report type
 */
const Header: React.FC<HeaderProps> = ({ 
  companyName, 
  period, 
  basisType, 
  reportType 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-lg shadow-md my-6 overflow-hidden">
      {/* Top Blue Navigation Bar */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 size={28} className="mr-3" />
          <div>
            <h1 className="text-2xl font-semibold">ProfitLens</h1>
            <p className="text-xs">Transform Data into Decisions</p>
          </div>
        </div>
        <button 
          onClick={() => alert('Export functionality to be implemented')} 
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center shadow"
        >
          <Download size={18} className="mr-2" />
          Export
        </button>
      </div>

      {/* Breadcrumbs and Main Header Content Container */}
      <div className="bg-white p-6">
        {/* Breadcrumbs */}
        <div className="mb-4 text-sm text-gray-600">
          <Link to="/" className="hover:underline text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700 font-medium">Financial Dashboard</span>
        </div>

        {/* Main Header Content (Company and Report Details) */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{companyName}</h2>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <FileText size={16} className="mr-2 text-gray-400" />
            <span>{period}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span>Basis: {basisType}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span>Report Type: {reportType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
