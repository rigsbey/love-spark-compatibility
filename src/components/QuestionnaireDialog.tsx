import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { TestResult } from "@/types/features";
import ProcessingAnimation from "./ProcessingAnimation";
import { useToast } from "@/components/ui/use-toast";

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

const ratingDescriptions = {
  1: "Совершенно не согласен",
  2: "Скорее не согласен",
  3: "Нейтрально",
  4: "Скорее согласен",
  5: "Полностью согласен"
};

const QuestionnaireDialog = ({ open, onOpenChange, date1, date2, onComplete }: QuestionnaireDialogProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [stage, setStage] = useState<"self" | "partner">("self");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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

  const calculateCategoryScore = (answers: Record<number, number>, category: string): number => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const maxPossibleScore = categoryQuestions.reduce((acc, q) => acc + (5 * q.weight), 0);
    
    let totalScore = 0;
    categoryQuestions.forEach((question, index) => {
      const answer = answers[question.id];
      
      // Для числовых ответов
      if (question.options[0].match(/^\d+$/)) {
        totalScore += answer * question.weight;
      } 
      // Для текстовых ответов
      else {
        const optionIndex = question.options.indexOf(answer.toString());
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
    setAnswers({});
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

  const handleAnswer = (answer: number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });

    if (Object.keys(answers).length === questions.length) {
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
      setAnswers({});
      setCurrentQuestion(0);
      setStage("self");
      setIsProcessing(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {currentQuestion === 0 ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pacifico text-accent text-center">
                Тест на совместимость в отношениях
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Этот тест основан на современных психологических исследованиях и поможет вам:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Понять уровень эмоциональной совместимости</li>
                <li>Оценить качество общения</li>
                <li>Выявить общие ценности</li>
                <li>Получить персональные рекомендации</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Как отвечать на вопросы:</h4>
                <p className="text-sm text-gray-600">
                  Оцените каждое утверждение по шкале от 1 до 5, где:
                </p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>1 — Совершенно не согласен</li>
                  <li>3 — Нейтрально</li>
                  <li>5 — Полностью согласен</li>
                </ul>
              </div>
            </div>

            <Button 
              onClick={() => setCurrentQuestion(1)}
              className="w-full bg-accent hover:bg-accent/90 text-white"
            >
              Начать тест
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                <div 
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                />
              </div>
              <DialogTitle className="text-xl font-medium">
                Вопрос {currentQuestion} из {questions.length}
              </DialogTitle>
              <DialogDescription className="text-lg mt-4">
                {questions[currentQuestion - 1].text}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleAnswer(rating)}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    answers[questions[currentQuestion - 1].id] === rating
                      ? "bg-accent text-white border-accent"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{ratingDescriptions[rating]}</span>
                    <span className="text-sm opacity-70">{rating}/5</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                disabled={currentQuestion === 1}
              >
                Назад
              </Button>
              <Button
                onClick={handleAnswer(0)}
                disabled={!answers[questions[currentQuestion - 1].id]}
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
              >
                {currentQuestion === questions.length ? "Завершить" : "Далее"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireDialog;