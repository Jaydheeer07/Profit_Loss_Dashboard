
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import GaugeChart from './GaugeChart';
import MetricCard from './MetricCard';

const lineChartData = [
  { year: '2014', value: 35 },
  { year: '2015', value: 25 },
  { year: '2016', value: 38 },
  { year: '2017', value: 22 },
  { year: '2018', value: 30 },
  { year: '2019', value: 26 },
];

const ResultsComparisonPanel = () => {
  return (
    <Card className="bg-[#1b184a] border-0">
      <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
          </svg>
          Results Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-white mb-4">
          From 1/1/19 to 12/23/19 (357 days) vs period from 1/1/18 to 12/31/18 (365 days)
        </div>
        
        {/* Top row with Income and Operational profit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Income Panel */}
          <Card className="bg-[#242254] border-0">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-lg font-semibold text-center text-white">Income</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-300">Actual period</div>
                  <div className="text-lg font-semibold text-white">$36,774,845.554</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Previous period</div>
                  <div className="text-lg font-semibold text-white">$30,964,045.751</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Difference in $</div>
                  <div className="text-lg font-semibold text-green-400">$5,810,799.803</div>
                </div>
              </div>
              
              <div className="mt-4">
                <GaugeChart value={18.77} label="18,77%" />
              </div>
              
              <div className="h-24 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={lineChartData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#43b8ea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#43b8ea" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tick={{ fill: '#a0aec0', fontSize: 10 }} axisLine={{ stroke: '#333357' }} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#43b8ea" 
                      fill="url(#colorIncome)" 
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Operational Profit Panel */}
          <Card className="bg-[#242254] border-0">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-lg font-semibold text-center text-white">Operational profit</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-300">Actual period</div>
                  <div className="text-lg font-semibold text-white">$2,414,126.616</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">7%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Previous period</div>
                  <div className="text-lg font-semibold text-white">$1,807,637.817</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">6%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          
        {/* Middle row with NonOperational and Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* NonOperational Panel */}
          <Card className="bg-[#242254] border-0">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-lg font-semibold text-center text-white">NonOperational</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-300">Actual period expenses</div>
                  <div className="text-lg font-semibold text-white">$324,940.411</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Previous period expenses</div>
                  <div className="text-lg font-semibold text-white">$332,905.902</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Actual period income</div>
                  <div className="text-lg font-semibold text-white">$457,076.105</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Previous period income</div>
                  <div className="text-lg font-semibold text-white">$493,851.971</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Costs Panel */}
          <Card className="bg-[#242254] border-0">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-lg font-semibold text-center text-white">Costs</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <div className="text-sm text-gray-300">Actual period</div>
                  <div className="text-lg font-semibold text-white">$23,659,136.534</div>
                  <div className="text-xs text-gray-400">% Over sales</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Previous period</div>
                  <div className="text-lg font-semibold text-white">$18,366,343.088</div>
                  <div className="text-xs text-gray-400">% Over sales</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <GaugeChart value={64.34} label="64,34%" />
                <GaugeChart value={59.32} label="59,32%" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom row with Operating Expenses and Net Profit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Operating Expenses Panel */}
          <Card className="bg-[#242254] border-0">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-lg font-semibold text-center text-white">Operating Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <div className="text-sm text-gray-300">Actual period</div>
                  <div className="text-lg font-semibold text-white">$10,701,582.404</div>
                  <div className="text-xs text-gray-400">% Over sales</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Previous period</div>
                  <div className="text-lg font-semibold text-white">$10,790,064.845</div>
                  <div className="text-xs text-gray-400">% Over sales</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <GaugeChart value={29.10} label="29,10%" />
                <GaugeChart value={34.85} label="34,85%" />
              </div>
            </CardContent>
          </Card>
          
          {/* Net Profit Panel */}
          <Card className="bg-[#242254] border-0">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-lg font-semibold text-center text-white">Net profit</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="text-sm text-gray-300">Actual period</div>
                <div className="text-xl font-semibold text-white">$2,546,262.310</div>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-24 text-sm text-gray-300">Net margin</div>
                <div className="flex-1 bg-blue-200 h-5 rounded">
                  <div className="bg-blue-500 h-full rounded" style={{ width: '70%' }}></div>
                </div>
                <div className="w-8 text-right font-semibold text-green-400">7%</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-300">Previous period</div>
                <div className="text-xl font-semibold text-white">$1,968,583.887</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-300">Net margin</div>
                <div className="flex-1 bg-blue-200 h-5 rounded">
                  <div className="bg-blue-500 h-full rounded" style={{ width: '60%' }}></div>
                </div>
                <div className="w-8 text-right font-semibold text-green-400">6%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsComparisonPanel;
