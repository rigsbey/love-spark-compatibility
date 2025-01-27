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
  const [result, setResult] = useState<TestResult | null>(null);
  const [isPremium] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const { toast } = useToast();

  const startFullTest = () => {
    setIsQuestionnaireOpen(true);
  };

  const resetCalculator = () => {
    setResult(null);
  };

  const handleComplete = (result: TestResult) => {
    setResult(result);
    setIsQuestionnaireOpen(false);
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
              <h2 className="text-2xl font-pacifico text-accent">Психологический тест на совместимость</h2>
              {!isPremium && (
                <Badge variant="secondary" className="bg-custom-pink">
                  Бесплатно
                </Badge>
              )}
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Этот тест основан на современных психологических исследованиях в области межличностных отношений. 
                Он поможет вам:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Понять уровень эмоциональной совместимости</li>
                <li>Оценить качество коммуникации</li>
                <li>Выявить общие ценности и цели</li>
                <li>Определить потенциальные зоны роста</li>
              </ul>
            </div>
            <Button
              onClick={startFullTest}
              className="w-full bg-primary hover:bg-primary-hover text-white text-lg py-6"
            >
              Пройти тест совместимости
            </Button>
            {!isPremium && (
              <div className="mt-4 p-4 bg-custom-blue/20 rounded-lg">
                <h3 className="text-lg font-semibold text-accent mb-2">
                  🌟 Premium анализ
                </h3>
                <ul className="text-sm space-y-2">
                  <li>✨ Расширенный анализ совместимости</li>
                  <li>📊 Детальные инсайты об отношениях</li>
                  <li>💫 Персональные рекомендации</li>
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
          <CompatibilityResult result={result} isPremium={isPremium} onReset={resetCalculator} />
        )}
      </div>

      <QuestionnaireDialog
        open={isQuestionnaireOpen}
        onOpenChange={setIsQuestionnaireOpen}
        date1={date1}
        date2={date2}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default Index;