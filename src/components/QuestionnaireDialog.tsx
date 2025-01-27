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
  stage: "self" | "partner";
}

const questions: Question[] = [
  {
    id: 1,
    text: "Как вы проводите свободное время?",
    options: ["Активный отдых", "Спокойный досуг", "Смешанный формат"],
    stage: "self"
  },
  {
    id: 2,
    text: "Как вы решаете конфликты?",
    options: ["Обсуждаем сразу", "Нужно время подумать", "Избегаем конфликтов"],
    stage: "self"
  },
  {
    id: 3,
    text: "Какие у вас общие цели?",
    options: ["Семья и быт", "Карьера и развитие", "Путешествия и впечатления"],
    stage: "partner"
  },
  {
    id: 4,
    text: "Как ваш партнер относится к финансам?",
    options: ["Планирует всё", "Тратит спонтанно", "Баланс экономии и трат"],
    stage: "partner"
  },
  {
    id: 5,
    text: "Что для вашего партнера важнее в отношениях?",
    options: ["Стабильность", "Развитие", "Комфорт"],
    stage: "partner"
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
  const [stage, setStage] = useState<"self" | "partner">("self");

  const currentStageQuestions = questions.filter(q => q.stage === stage);
  const totalQuestions = questions.length;
  const currentStageProgress = (currentQuestion / totalQuestions) * 100;

  const getStageTitle = () => {
    return stage === "self" ? "О вас" : "О вашем партнере";
  };

  const getMotivationalMessage = () => {
    const progress = currentStageProgress;
    if (progress < 30) return "Отличное начало!";
    if (progress < 60) return "Вы прекрасно справляетесь!";
    if (progress < 90) return "Почти готово!";
    return "Последний шаг!";
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => {
        const nextQuestion = prev + 1;
        const nextQuestionStage = questions[nextQuestion].stage;
        if (stage !== nextQuestionStage) {
          setStage(nextQuestionStage);
        }
        return nextQuestion;
      });
    } else {
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
      setCurrentQuestion(0);
      setAnswers([]);
      setStage("self");
    }
  };

  const calculateDateCompatibility = (date1: string, date2: string): number => {
    const timestamp1 = new Date(date1).getTime();
    const timestamp2 = new Date(date2).getTime();
    const difference = Math.abs(timestamp1 - timestamp2);
    const maxDiff = 1000 * 60 * 60 * 24 * 365 * 10;
    return Math.round(Math.max(0, Math.min(100, 100 - (difference / maxDiff) * 100)));
  };

  const calculateAnswerCompatibility = (answers: string[]): number => {
    const baseScore = 70;
    const variation = answers.length * 5;
    return Math.min(100, Math.max(0, baseScore + Math.random() * variation));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white shadow-lg backdrop-blur-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pacifico text-accent text-center mb-4">
            {getStageTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-6">
          <Progress 
            value={currentStageProgress} 
            className="h-2 bg-gray-100"
          />
          <div className="mt-2 text-center space-y-1">
            <span className="text-sm text-gray-600 block">
              Вопрос {currentQuestion + 1} из {totalQuestions}
            </span>
            <span className="text-sm text-accent font-medium block">
              {getMotivationalMessage()}
            </span>
          </div>
        </div>

        <Card className="p-6 bg-white shadow-sm border border-gray-100 animate-fade-in">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            {questions[currentQuestion].text}
          </h3>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left py-4 px-6 bg-white hover:bg-accent/5 hover:border-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-gray-700 hover:text-accent"
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