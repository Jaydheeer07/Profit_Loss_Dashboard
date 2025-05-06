/**
 * Process flow component that displays the 3-step workflow for the ProfitLens dashboard.
 */

import { FileUp, BarChart, Lightbulb } from 'lucide-react';

const ProcessFlow = () => {
  const steps = [
    {
      icon: <FileUp className="h-10 w-10 text-blue-500" />,
      title: 'Upload',
      description: 'Upload your Profit & Loss Excel file from Xero or other accounting software.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-blue-500" />,
      title: 'Generate Insights',
      description: 'Our AI analyzes your financial data to calculate key metrics and ratios.',
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-blue-500" />,
      title: 'View Dashboard',
      description: 'Explore interactive visualizations and receive actionable recommendations.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-800">
          How ProfitLens Works
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Step content */}
                <div className="bg-white rounded-lg shadow-md p-6 text-center h-full w-full flex flex-col items-center">
                  <div className="mb-4 p-3 bg-blue-50 rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gray-300 transform -translate-y-1/2 -translate-x-4">
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
