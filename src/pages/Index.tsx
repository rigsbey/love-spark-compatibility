import { useState } from "react";
import { Button } from "@/components/ui/button";
import DateInput from "@/components/DateInput";
import CompatibilityResult from "@/components/CompatibilityResult";
import FloatingStars from "@/components/FloatingStars";
import QuestionnaireDialog from "@/components/QuestionnaireDialog";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { TestResult } from "@/types/features";

const Index = () => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [isPremium] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const { toast } = useToast();

  const calculateQuickCompatibility = () => {
    if (!date1 || !date2) {
      toast({
        title: "Пожалуйста, введите обе даты",
        description: "Для расчета совместимости необходимы обе даты рождения",
        variant: "destructive",
      });
      return;
    }

    const timestamp1 = new Date(date1).getTime();
    const timestamp2 = new Date(date2).getTime();
    const difference = Math.abs(timestamp1 - timestamp2);
    const maxDiff = 1000 * 60 * 60 * 24 * 365 * 10;
    const compatibility = Math.round(Math.max(0, Math.min(100, 100 - (difference / maxDiff) * 100)));
    
    const result: TestResult = {
      compatibility,
      strengths: ["Эмоциональная связь", "Потенциал для общения"],
      growthAreas: ["Разный жизненный опыт", "Различные перспективы"],
      premiumInsights: isPremium ? ["Глубокая психологическая совместимость", "Прогноз долгосрочных отношений"] : undefined
    };
    
    setResult(result);
  };

  const startFullTest = () => {
    if (!date1 || !date2) {
      toast({
        title: "Пожалуйста, введите обе даты",
        description: "Для начала теста необходимы обе даты рождения",
        variant: "destructive",
      });
      return;
    }
    setIsQuestionnaireOpen(true);
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
          Совместимость в любви
        </h1>
        
        {result === null ? (
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-pacifico text-accent">Тест</h2>
              {!isPremium && (
                <Badge variant="secondary" className="bg-custom-pink">
                  Бесплатно
                </Badge>
              )}
            </div>
            <DateInput
              label="Ваша дата рождения"
              value={date1}
              onChange={setDate1}
            />
            <DateInput
              label="Дата рождения партнера"
              value={date2}
              onChange={setDate2}
            />
            <div className="space-y-3">
              <Button
                onClick={calculateQuickCompatibility}
                className="w-full bg-primary hover:bg-primary-hover text-white text-lg py-6"
              >
                Быстрый расчет
              </Button>
              <Button
                onClick={startFullTest}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-white text-lg py-6"
              >
                Пройти полный тест
              </Button>
            </div>
            {!isPremium && (
              <div className="mt-4 p-4 bg-custom-blue/20 rounded-lg">
                <h3 className="text-lg font-semibold text-accent mb-2">
                  🌟 Откройте Premium возможности
                </h3>
                <ul className="text-sm space-y-2">
                  <li>✨ Расширенный анализ совместимости</li>
                  <li>📊 Детальные инсайты об отношениях</li>
                  <li>💫 Ежедневные прогнозы</li>
                </ul>
                <Button
                  variant="outline"
                  className="mt-3 w-full border-accent text-accent hover:bg-accent hover:text-white"
                  onClick={() => toast({
                    title: "Скоро!",
                    description: "Premium функции будут доступны в ближайшее время.",
                  })}
                >
                  Активировать Premium
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

      <QuestionnaireDialog
        open={isQuestionnaireOpen}
        onOpenChange={setIsQuestionnaireOpen}
        date1={date1}
        date2={date2}
        onComplete={setResult}
      />
    </div>
  );
};

export default Index;