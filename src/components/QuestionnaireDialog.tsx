import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { TestResult } from "@/types/features";
import ProcessingAnimation from "./ProcessingAnimation";

interface Question {
  id: number;
  text: string;
  options: string[];
  stage: "self" | "partner";
  category: "attachment" | "loveLanguages" | "trust" | "values" | "communication" | "emotional" | "independence" | "future";
  weight: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Мне легко говорить о своих чувствах партнеру.",
    options: ["1", "2", "3", "4", "5"],
    stage: "self",
    category: "attachment",
    weight: 0.2
  },
  {
    id: 2,
    text: "Я боюсь, что партнер может меня покинуть.",
    options: ["1", "2", "3", "4", "5"],
    stage: "self",
    category: "attachment",
    weight: 0.2
  },
  {
    id: 3,
    text: "Как вы относитесь к личному пространству в отношениях?",
    options: [
      "Важно иметь много личного времени",
      "Баланс между личным и общим",
      "Предпочитаю всё делать вместе"
    ],
    stage: "self",
    category: "independence",
    weight: 0.2
  },
  {
    id: 4,
    text: "Как вы выражаете свои чувства?",
    options: [
      "Открыто проявляю эмоции",
      "Сдержанно, но искренне",
      "Предпочитаю действия словам"
    ],
    stage: "self",
    category: "emotional",
    weight: 0.2
  },
  {
    id: 5,
    text: "Как вы видите будущее отношений?",
    options: [
      "Стабильность и семья",
      "Развитие и карьера",
      "Путешествия и впечатления"
    ],
    stage: "self",
    category: "future",
    weight: 0.25
  },
  {
    id: 6,
    text: "Что для вас важнее?",
    options: [
      "Подарки от партнера",
      "Время, проведенное вместе",
      "Слова поддержки",
      "Физическая близость",
      "Помощь в делах"
    ],
    stage: "self",
    category: "loveLanguages",
    weight: 0.25
  },
  {
    id: 7,
    text: "Я чувствую себя полностью уверенным в своем партнере.",
    options: ["1", "2", "3", "4", "5"],
    stage: "self",
    category: "trust",
    weight: 0.25
  },
  {
    id: 8,
    text: "Как ваш партнер справляется с конфликтами?",
    options: [
      "Обсуждает проблемы сразу",
      "Берёт паузу для обдумывания",
      "Старается избегать конфликтов"
    ],
    stage: "partner",
    category: "communication",
    weight: 0.2
  },
  {
    id: 9,
    text: "Какие ценности наиболее важны для вашего партнера?",
    options: [
      "Честность и доверие",
      "Развитие и рост",
      "Комфорт и стабильность"
    ],
    stage: "partner",
    category: "values",
    weight: 0.15
  },
  {
    id: 10,
    text: "Какие любовные языки использует ваш партнер?",
    options: [
      "Физическая близость",
      "Подарки",
      "Слова поддержки",
      "Время вместе",
      "Помощь в делах"
    ],
    stage: "partner",
    category: "loveLanguages",
    weight: 0.2
  },
  {
    id: 11,
    text: "Я чувствую себя полностью уверенным в своем партнере.",
    options: ["1", "2", "3", "4", "5"],
    stage: "self",
    category: "trust",
    weight: 0.25
  },
  {
    id: 12,
    text: "Я чувствую себя полностью удовлетворенным в своем партнере.",
    options: ["1", "2", "3", "4", "5"],
    stage: "self",
    category: "trust",
    weight: 0.25
  }
];

interface QuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date1: string;
  date2: string;
  onComplete: (result: TestResult) => void;
}

interface CompatibilityAnalysis {
  type: 'excellent' | 'good' | 'moderate' | 'challenging';
  description: string;
  recommendations: string[];
}

const QuestionnaireDialog = ({ open, onOpenChange, date1, date2, onComplete }: QuestionnaireDialogProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [stage, setStage] = useState<"self" | "partner">("self");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const calculateCategoryScore = (answers: string[], category: string): number => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const maxPossibleScore = categoryQuestions.reduce((acc, q) => acc + (5 * q.weight), 0);
    
    let totalScore = 0;
    categoryQuestions.forEach((question, index) => {
      const answer = answers[questions.indexOf(question)];
      
      // Для числовых ответов
      if (question.options[0].match(/^\d+$/)) {
        totalScore += parseInt(answer) * question.weight;
      } 
      // Для текстовых ответов
      else {
        const optionIndex = question.options.indexOf(answer);
        const normalizedScore = ((optionIndex + 1) / question.options.length) * 5;
        totalScore += normalizedScore * question.weight;
      }
    });

    return Math.round((totalScore / maxPossibleScore) * 100);
  };

  const calculateFinalResult = (): TestResult => {
    // Вычисляем баллы по категориям
    const categoryScores = {
      attachment: calculateCategoryScore(answers, "attachment"),
      loveLanguages: calculateCategoryScore(answers, "loveLanguages"),
      trust: calculateCategoryScore(answers, "trust"),
      values: calculateCategoryScore(answers, "values"),
      communication: calculateCategoryScore(answers, "communication"),
      emotional: calculateCategoryScore(answers, "emotional"),
      independence: calculateCategoryScore(answers, "independence"),
      future: calculateCategoryScore(answers, "future")
    };

    // Вычисляем общую совместимость как среднее значение по категориям
    const compatibility = Math.round(
      Object.values(categoryScores).reduce((acc, score) => acc + score, 0) / 
      Object.keys(categoryScores).length
    );

    // Определяем тип совместимости
    let compatibilityType: 'excellent' | 'good' | 'moderate' | 'challenging';
    if (compatibility >= 80) compatibilityType = 'excellent';
    else if (compatibility >= 65) compatibilityType = 'good';
    else if (compatibility >= 50) compatibilityType = 'moderate';
    else compatibilityType = 'challenging';

    // Формируем рекомендации
    const recommendations = [];
    if (categoryScores.attachment > 70) {
      recommendations.push("У вас безопасный стиль привязанности");
    }
    if (categoryScores.trust < 60) {
      recommendations.push("Стоит поработать над укреплением доверия");
    }
    if (categoryScores.communication > 75) {
      recommendations.push("У вас отличные навыки общения");
    }
    if (categoryScores.values > 70) {
      recommendations.push("Ваши ценности хорошо совпадают");
    }

    return {
      compatibility,
      compatibilityType,
      description: getCompatibilityDescription(compatibilityType),
      strengths: recommendations.filter((_, i) => i < 2),
      growthAreas: recommendations.filter((_, i) => i >= 2),
      categoryScores
    };
  };

  const handleProcessingComplete = () => {
    const result = calculateFinalResult();
    onComplete(result);
    setIsProcessing(false);
    setAnswers([]);
    setCurrentQuestion(0);
    setStage("self");
  };

  const getCompatibilityDescription = (type: 'excellent' | 'good' | 'moderate' | 'challenging'): string => {
    switch (type) {
      case 'excellent':
        return 'У вас отличная совместимость! Продолжайте развивать ваши отношения.';
      case 'good':
        return 'У вас хорошая совместимость. Есть прочная основа для развития отношений.';
      case 'moderate':
        return 'У вас средняя совместимость. Работайте над укреплением связи.';
      case 'challenging':
        return 'Вам стоит больше работать над отношениями и улучшать взаимопонимание.';
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (newAnswers.length === questions.length) {
      setIsProcessing(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const calculateDateCompatibility = (date1: string, date2: string): number => {
    const timestamp1 = new Date(date1).getTime();
    const timestamp2 = new Date(date2).getTime();
    const difference = Math.abs(timestamp1 - timestamp2);
    const maxDiff = 1000 * 60 * 60 * 24 * 365 * 10;
    return Math.round(Math.max(0, Math.min(100, 100 - (difference / maxDiff) * 100)));
  };

  const getCategoryStrength = (categories: Record<string, number>): string => {
    const maxCategory = Object.entries(categories).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0];

    const categoryNames = {
      values: 'ваши общие ценности',
      communication: 'навыки общения',
      emotional: 'эмоциональную связь',
      independence: 'уважение к личному пространству',
      future: 'совместные планы на будущее'
    };

    return categoryNames[maxCategory as keyof typeof categoryNames];
  };

  useEffect(() => {
    if (!open) {
      setAnswers([]);
      setCurrentQuestion(0);
      setStage("self");
      setIsProcessing(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white shadow-lg backdrop-blur-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pacifico text-accent text-center mb-4">
            {isProcessing ? "Анализ совместимости" : getStageTitle()}
          </DialogTitle>
        </DialogHeader>
        
        {isProcessing ? (
          <ProcessingAnimation onComplete={handleProcessingComplete} />
        ) : (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireDialog;