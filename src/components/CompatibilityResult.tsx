import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TestResult } from "@/types/features";

interface CompatibilityResultProps {
  result: TestResult;
  isPremium: boolean;
  onReset: () => void;
}

const CompatibilityResult = ({ result, isPremium, onReset }: CompatibilityResultProps) => {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-pacifico text-accent mb-4">Your Compatibility Score</h2>
      <div className="relative mb-6">
        <Progress value={result.compatibility} className="h-4" />
        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-lg font-bold">
          {result.compatibility}%
        </span>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-accent mb-2">Relationship Strengths</h3>
          <ul className="list-disc list-inside space-y-1">
            {result.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-accent mb-2">Areas for Growth</h3>
          <ul className="list-disc list-inside space-y-1">
            {result.growthAreas.map((area, index) => (
              <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </div>

        {isPremium && result.premiumInsights && (
          <div>
            <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
              Premium Insights
              <Badge variant="secondary" className="bg-[#FFD700] text-black">
                Premium
              </Badge>
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {result.premiumInsights.map((insight, index) => (
                <li key={index} className="text-gray-700">{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Button
          onClick={onReset}
          className="w-full bg-secondary hover:bg-secondary-hover text-white"
        >
          Try Another Match
        </Button>
        
        {!isPremium && (
          <Button
            variant="outline"
            className="w-full border-accent text-accent hover:bg-accent hover:text-white"
          >
            Unlock Premium Features
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompatibilityResult;