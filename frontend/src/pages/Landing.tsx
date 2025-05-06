/**
 * Landing page for ProfitLens that integrates all landing components.
 */

import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FileUpload from "@/components/landing/FileUpload";
import ProcessFlow from "@/components/landing/ProcessFlow";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FileUpload />
        <ProcessFlow />
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold">Profit<span className="text-blue-400">Lens</span></div>
              <div className="text-sm text-gray-400">Transform Data into Decisions</div>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} ProfitLens. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
