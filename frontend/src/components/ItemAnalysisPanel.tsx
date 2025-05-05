
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const itemAnalysisData = [
  { year: '2013', income: 45, costs: 25, expenses: 18 },
  { year: '2014', income: 40, costs: 22, expenses: 12 },
  { year: '2015', income: 24, costs: 12, expenses: 9 },
  { year: '2016', income: 28, costs: 16, expenses: 11 },
  { year: '2017', income: 24, costs: 18, expenses: 8 },
  { year: '2018', income: 30, costs: 17, expenses: 10 },
  { year: '2019', income: 37, costs: 22, expenses: 12 },
];

const ItemAnalysisPanel = () => {
  return (
    <Card className="bg-[#1b184a] border-0">
      <CardHeader className="bg-[#4053b5] text-white rounded-t-lg pb-3 pt-3 px-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          Item Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={itemAnalysisData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid vertical={false} stroke="#333357" />
              <XAxis dataKey="year" tick={{ fill: '#a0aec0' }} axisLine={{ stroke: '#333357' }} />
              <YAxis tick={{ fill: '#a0aec0' }} domain={[0, 50]} axisLine={{ stroke: '#333357' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#242254', border: 'none', borderRadius: '4px' }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="income" name="total operating income" fill="#43b8ea" />
              <Bar dataKey="costs" name="total costs" fill="#c2a736" />
              <Bar dataKey="expenses" name="total operating expenses" fill="#a854f7" />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '10px',
                  bottom: -10 
                }}
                formatter={(value) => <span style={{ color: '#a0aec0' }}>{value}</span>}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemAnalysisPanel;
