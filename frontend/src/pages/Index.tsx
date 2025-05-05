
import ProfitLossHeader from "@/components/ProfitLossHeader";
import HistoricalDataPanel from "@/components/HistoricalDataPanel";
import ResultsComparisonPanel from "@/components/ResultsComparisonPanel";
import ItemAnalysisPanel from "@/components/ItemAnalysisPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#171332] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <ProfitLossHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <div className="space-y-5">
            <HistoricalDataPanel />
            <ItemAnalysisPanel />
          </div>
          <div>
            <ResultsComparisonPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
