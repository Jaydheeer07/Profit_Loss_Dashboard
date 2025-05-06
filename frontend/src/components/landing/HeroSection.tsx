/**
 * Hero section component for the ProfitLens landing page.
 */

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left column - Text content */}
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Transform Your <span className="text-blue-600">Financial Data</span> Into Actionable Insights
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              ProfitLens uses AI to analyze your profit & loss statements and provide personalized recommendations to improve your business performance.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
                <a href="#upload-section">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium">
                <Link to="/dashboard">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
              
              <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden">
                <img 
                  src="/dashboard-sample.png" 
                  alt="ProfitLens Dashboard Preview" 
                  className="w-full h-auto"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400/e6f7ff/0099ff?text=ProfitLens+Dashboard";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: '93%', label: 'Accuracy in financial analysis' },
            { value: '2.5x', label: 'Faster decision making' },
            { value: '15%', label: 'Average profit improvement' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
