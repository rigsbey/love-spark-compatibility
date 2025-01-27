import { useState } from "react";
import { Button } from "@/components/ui/button";
import DateInput from "@/components/DateInput";
import CompatibilityResult from "@/components/CompatibilityResult";
import FloatingStars from "@/components/FloatingStars";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { TestResult } from "@/types/features";

const Index = () => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [isPremium] = useState(false); // This would be connected to auth state in the future
  const { toast } = useToast();

  const calculateCompatibility = () => {
    if (!date1 || !date2) {
      toast({
        title: "Please enter both dates",
        description: "We need both birth dates to calculate compatibility",
        variant: "destructive",
      });
      return;
    }

    // Simple compatibility calculation for demo
    const timestamp1 = new Date(date1).getTime();
    const timestamp2 = new Date(date2).getTime();
    const difference = Math.abs(timestamp1 - timestamp2);
    const maxDiff = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years
    const compatibility = Math.round(Math.max(0, Math.min(100, 100 - (difference / maxDiff) * 100)));
    
    const result: TestResult = {
      compatibility,
      strengths: ["Strong emotional connection", "Great communication potential"],
      growthAreas: ["Different life experiences", "Varying perspectives"],
      premiumInsights: isPremium ? ["Deep psychological compatibility", "Long-term relationship forecast"] : undefined
    };
    
    setResult(result);
  };

  const resetCalculator = () => {
    setDate1("");
    setDate2("");
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <FloatingStars />
      <div className="z-10 w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-pacifico text-accent text-center mb-8">
          Love Compatibility
        </h1>
        
        {result === null ? (
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-pacifico text-accent">Basic Test</h2>
              {!isPremium && (
                <Badge variant="secondary" className="bg-custom-pink">
                  Free
                </Badge>
              )}
            </div>
            <DateInput
              label="Your Birth Date"
              value={date1}
              onChange={setDate1}
            />
            <DateInput
              label="Partner's Birth Date"
              value={date2}
              onChange={setDate2}
            />
            <Button
              onClick={calculateCompatibility}
              className="w-full bg-primary hover:bg-primary-hover text-white text-lg py-6"
            >
              Calculate Compatibility
            </Button>
            {!isPremium && (
              <div className="mt-4 p-4 bg-custom-blue/20 rounded-lg">
                <h3 className="text-lg font-semibold text-accent mb-2">
                  🌟 Unlock Premium Features
                </h3>
                <ul className="text-sm space-y-2">
                  <li>✨ Extended compatibility analysis</li>
                  <li>📊 Detailed relationship insights</li>
                  <li>💫 Daily relationship forecasts</li>
                </ul>
                <Button
                  variant="outline"
                  className="mt-3 w-full border-accent text-accent hover:bg-accent hover:text-white"
                  onClick={() => toast({
                    title: "Coming Soon!",
                    description: "Premium features will be available soon.",
                  })}
                >
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </div>
        ) : (
          <CompatibilityResult
            result={result}
            isPremium={isPremium}
            onReset={resetCalculator}
          />
        )}
      </div>
    </div>
  );
};

export default Index;