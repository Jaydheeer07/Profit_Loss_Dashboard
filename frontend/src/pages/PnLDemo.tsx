
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PnLDashboard from '@/components/PnLDashboard';
import { PnLData } from '@/types/pnlTypes';
import { Button } from '@/components/ui/button';

// Sample data as fallback if no real data is available
const sampleData: PnLData = {
  "companyName": "Augment Pty Ltd",
  "period": "For The Month Ended 30 April 2025",
  "basisType": "Accrual",
  "reportType": "Complete",
  "sections": {
    "tradingIncome": {
      "accounts": [
        {
          "name": "200 - Sales",
          "value": 746947.01,
          "category": "Sales"
        },
        {
          "name": "210 - Sales - Print House",
          "value": 50543.99,
          "category": "Sales"
        },
        {
          "name": "260 - Other Revenue",
          "value": 228.85,
          "category": "Sales"
        }
      ],
      "total": 797719.85
    },
    "costOfSales": {
      "accounts": [
        {
          "name": "307 - Suppliers: Contract Staff",
          "value": 4750.0,
          "category": "Direct Costs"
        },
        {
          "name": "315 - Suppliers: Copywriting",
          "value": 16420.0,
          "category": "Direct Costs"
        },
        {
          "name": "330 - Suppliers: Printer and Mail House",
          "value": -1208.84,
          "category": "Direct Costs"
        },
        {
          "name": "340 - Suppliers: Photography/Image Purchase",
          "value": 109.0,
          "category": "Direct Costs"
        },
        {
          "name": "365 - Suppliers: Facebook / Reimbursables",
          "value": 34383.86,
          "category": "Direct Costs"
        },
        {
          "name": "464 - Suppliers: Software & Website Admin",
          "value": 2233.88,
          "category": "Software"
        }
      ],
      "total": 56687.9
    },
    "grossProfit": 741031.95,
    "operatingExpenses": {
      "accounts": [
        {
          "name": "404 - Bank Fees",
          "value": 10.0,
          "category": "Bank Charges"
        },
        {
          "name": "409 - Accounting & Bookkeeping",
          "value": 4392.81,
          "category": "Accounting"
        },
        {
          "name": "423 - Donations",
          "value": 53.15,
          "category": "Donations"
        },
        {
          "name": "442 - Lease - Photocopier",
          "value": 140.01,
          "category": "Rent & Lease"
        },
        {
          "name": "445 - Light, Power, Heating",
          "value": 544.52,
          "category": "Other Expenses"
        },
        {
          "name": "461 - Printing & Stationery",
          "value": 0.7,
          "category": "Other Expenses"
        },
        {
          "name": "466 - Marketing/Business Development",
          "value": 11140.0,
          "category": "Marketing"
        },
        {
          "name": "469 - Rent: Adelaide",
          "value": 4591.67,
          "category": "Rent & Lease"
        },
        {
          "name": "474 - Rent - Casual",
          "value": 2213.18,
          "category": "Rent & Lease"
        },
        {
          "name": "475/01 - Rent - Erskineville",
          "value": 3250.0,
          "category": "Rent & Lease"
        },
        {
          "name": "475/02 - Rent - Southbank",
          "value": 3900.0,
          "category": "Rent & Lease"
        },
        {
          "name": "477 - Wages and Salaries",
          "value": 251530.65,
          "category": "Salaries & Wages"
        },
        {
          "name": "478 - Superannuation",
          "value": 29086.66,
          "category": "Other Expenses"
        },
        {
          "name": "479 - Workcover",
          "value": 663.65,
          "category": "Other Expenses"
        },
        {
          "name": "480 - Payroll Tax",
          "value": -0.01,
          "category": "Salaries & Wages"
        },
        {
          "name": "485 - Subscriptions",
          "value": 1794.99,
          "category": "Subscriptions"
        },
        {
          "name": "489 - Telephone & Internet",
          "value": 142.37,
          "category": "Telecommunications"
        },
        {
          "name": "490 - Training & Development (must not include alcohol)",
          "value": 657.74,
          "category": "Training & Development"
        },
        {
          "name": "493 - Travel - National",
          "value": 2224.59,
          "category": "Travel"
        },
        {
          "name": "494 - Travel - International",
          "value": 5236.22,
          "category": "Travel"
        },
        {
          "name": "498 - Unrealised Currency Gains",
          "value": 500.04,
          "category": "Other Expenses"
        },
        {
          "name": "499 - Realised Currency Gains",
          "value": 2.99,
          "category": "Other Expenses"
        },
        {
          "name": "580 - Paid Parental Leave",
          "value": 995.19,
          "category": "Rent & Lease"
        }
      ],
      "total": 323071.12
    },
    "netProfit": 417960.83
  },
  "metadata": {
    "uploadDate": "2025-05-05",
    "source": "temp_upload.xlsx",
    "currency": "USD"
  }
};

const PnLDemoPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<PnLData>(sampleData);
  const [isRealData, setIsRealData] = useState<boolean>(false);

  useEffect(() => {
    // Try to get data from localStorage
    const storedData = localStorage.getItem('pnlData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setDashboardData(parsedData);
        setIsRealData(true);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        // Fallback to sample data if parsing fails
        setDashboardData(sampleData);
      }
    }
  }, []);

  const handleBackToUpload = () => {
    // Clear stored data and navigate back to the upload page
    localStorage.removeItem('pnlData');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-4">
        {isRealData && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">
              <span className="bg-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                Real Data
              </span>
              Viewing your uploaded financial data
            </div>
            <Button 
              variant="outline" 
              onClick={handleBackToUpload}
              className="text-white border-white hover:bg-gray-800"
            >
              Upload New File
            </Button>
          </div>
        )}
        <PnLDashboard data={dashboardData} />
      </div>
    </div>
  );
};

export default PnLDemoPage;
