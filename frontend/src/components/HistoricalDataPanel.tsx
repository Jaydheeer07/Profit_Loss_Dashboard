
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import MetricCard from './MetricCard';

const historicalData = [
  { year: '2013', value: 5351 },
  { year: '2014', value: 7070 },
  { year: '2015', value: 1663 },
  { year: '2016', value: 825 },
  { year: '2017', value: 272 },
  { year: '2018', value: 1969 },
  { year: '2019', value: 2546 },
];

const HistoricalDataPanel = () => {
  return (
    <Card className="bg-[#1b184a] border-0">
      <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Useful Historical Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3">
          <MetricCard 
            value="$2,546.26" 
            description="Utility last year" 
            backgroundColor="#242254"
          />
          <MetricCard 
            value="$1,968.58" 
            description="Utility last year" 
            backgroundColor="#242254"
          />
          <MetricCard 
            value="$2,477.51" 
            description="Utility this month" 
            backgroundColor="#242254"
          />
          <MetricCard 
            value="$2,826.49" 
            description="Utility this semester" 
            backgroundColor="#242254"
          />
        </div>
        
        <div className="h-64 px-2 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43b8ea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#43b8ea" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#333357" />
              <XAxis dataKey="year" tick={{ fill: '#a0aec0' }} axisLine={{ stroke: '#333357' }} />
              <YAxis tick={{ fill: '#a0aec0' }} domain={[0, 8000]} axisLine={{ stroke: '#333357' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#242254', border: 'none', borderRadius: '4px' }}
                labelStyle={{ color: 'white' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#43b8ea" 
                strokeWidth={2}
                dot={{ fill: '#43b8ea', r: 4 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#43b8ea' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalDataPanel;
