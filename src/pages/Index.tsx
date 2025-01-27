import { useState } from "react";
import { Button } from "@/components/ui/button";
import DateInput from "@/components/DateInput";
import CompatibilityResult from "@/components/CompatibilityResult";
import FloatingStars from "@/components/FloatingStars";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<number | null>(null);
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
    const compatibility = Math.max(0, Math.min(100, 100 - (difference / maxDiff) * 100));
    
    setResult(Math.round(compatibility));
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
          </div>
        ) : (
          <CompatibilityResult
            percentage={result}
            onReset={resetCalculator}
          />
        )}
      </div>
    </div>
  );
};

export default Index;