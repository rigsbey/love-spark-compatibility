import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { TestResult } from "@/types/features";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Как вы проводите свободное время вместе?",
    options: ["Активный отдых", "Спокойный досуг", "Смешанный формат"]
  },
  {
    id: 2,
    text: "Как вы решаете конфликты?",
    options: ["Обсуждаем сразу", "Нужно время подумать", "Избегаем конфликтов"]
  },
  {
    id: 3,
    text: "Какие у вас общие цели?",
    options: ["Семья и быт", "Карьера и развитие", "Путешествия и впечатления"]
  },
  {
    id: 4,
    text: "Как вы относитесь к финансам?",
    options: ["Планируем вместе", "Раздельный бюджет", "Ситуативно"]
  },
  {
    id: 5,
    text: "Что для вас важнее в отношениях?",
    options: ["Стабильность", "Развитие", "Комфорт"]
  }
];

interface QuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date1: string;
  date2: string;
  onComplete: (result: TestResult) => void;
}

const QuestionnaireDialog = ({ open, onOpenChange, date1, date2, onComplete }: QuestionnaireDialogProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const progress = ((currentQuestion) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final result combining dates and answers
      const dateCompatibility = calculateDateCompatibility(date1, date2);
      const answerCompatibility = calculateAnswerCompatibility(newAnswers);
      const finalCompatibility = Math.round((dateCompatibility + answerCompatibility) / 2);

      const result: TestResult = {
        compatibility: finalCompatibility,
        strengths: [
          "Глубокое взаимопонимание",
          "Схожие жизненные цели",
          "Эффективная коммуникация"
        ],
        growthAreas: [
          "Работа над совместными планами",
          "Развитие эмоциональной связи"
        ]
      };

      onComplete(result);
      onOpenChange(false);
      // Reset for next time
      setCurrentQuestion(0);
      setAnswers([]);
    }
  };

  const calculateDateCompatibility = (date1: string, date2: string): number => {
    const timestamp1 = new Date(date1).getTime();
    const timestamp2 = new Date(date2).getTime();
    const difference = Math.abs(timestamp1 - timestamp2);
    const maxDiff = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years
    return Math.round(Math.max(0, Math.min(100, 100 - (difference / maxDiff) * 100)));
  };

  const calculateAnswerCompatibility = (answers: string[]): number => {
    // Simple demo calculation - in real app would be more complex
    const baseScore = 70; // Base compatibility score
    const variation = answers.length * 5; // Each answer can affect up to 5 points
    return Math.min(100, Math.max(0, baseScore + Math.random() * variation));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pacifico text-accent text-center">
            Тест на совместимость
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <span className="text-sm text-gray-500 mt-1">
            Вопрос {currentQuestion + 1} из {questions.length}
          </span>
        </div>

        <Card className="p-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">
            {questions[currentQuestion].text}
          </h3>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireDialog;