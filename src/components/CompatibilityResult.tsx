import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TestResult } from "@/types/features";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FeedbackForm from "@/components/FeedbackForm";

interface CompatibilityResultProps {
  result: TestResult;
  isPremium: boolean;
  onReset: () => void;
}

const CompatibilityResult = ({ result, isPremium, onReset }: CompatibilityResultProps) => {
  const [showTips, setShowTips] = useState(false);

  const getCompatibilityDescription = (compatibility: number) => {
    if (compatibility >= 80) return "Превосходная совместимость! У вас очень гармоничные отношения 💫";
    if (compatibility >= 65) return "Хорошая совместимость! Вы отлично дополняете друг друга ✨";
    if (compatibility >= 50) return "Неплохая совместимость. Есть потенциал для развития 🌱";
    return "Есть над чем поработать. Но это не приговор! 🌟";
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      attachment: "🤗",
      trust: "🤝",
      communication: "💭",
      values: "💝",
      emotional: "❤️",
      independence: "🦋",
      future: "🎯",
      loveLanguages: "💌"
    };
    return emojis[category] || "✨";
  };

  // Группировка категорий
  const categoryGroups = {
    emotional: {
      title: "Эмоциональная связь",
      categories: ["attachment", "trust", "emotional"],
      emoji: "❤️",
      getDescription: (scores: Record<string, number>) => {
        const avg = Object.entries(scores)
          .filter(([key]) => ["attachment", "trust", "emotional"].includes(key))
          .reduce((acc, [_, score]) => acc + score, 0) / 3;
        
        if (avg >= 75) return "Сильная эмоциональная связь. Продолжайте поддерживать друг друга!";
        if (avg >= 60) return "Хорошая эмоциональная связь. Можно укрепить через общение.";
        return "Стоит больше работать над эмоциональной близостью.";
      }
    },
    future: {
      title: "Взгляд в будущее",
      categories: ["future", "values"],
      emoji: "🎯",
      getDescription: (scores: Record<string, number>) => {
        const avg = Object.entries(scores)
          .filter(([key]) => ["future", "values"].includes(key))
          .reduce((acc, [_, score]) => acc + score, 0) / 2;
        
        if (avg >= 75) return "У вас схожие цели и ценности. Отличная основа!";
        if (avg >= 60) return "Ваши взгляды на будущее совместимы, но требуют обсуждения.";
        return "Уделите время обсуждению ваших целей и ценностей.";
      }
    },
    independence: {
      title: "Личное пространство",
      categories: ["communication", "independence"],
      emoji: "🦋",
      getDescription: (scores: Record<string, number>) => {
        const avg = Object.entries(scores)
          .filter(([key]) => ["communication", "independence"].includes(key))
          .reduce((acc, [_, score]) => acc + score, 0) / 2;
        
        if (avg >= 75) return "Отличный баланс личного пространства и общения!";
        if (avg >= 60) return "Хороший баланс, но иногда нужно больше общаться.";
        return "Стоит найти баланс между личным и общим временем.";
      }
    }
  };

  const getTips = () => [
    "Обсуждайте ваши чувства и переживания хотя бы раз в неделю",
    "Планируйте совместное будущее, ставьте общие цели",
    "Уважайте личное пространство друг друга",
    "Практикуйте активное слушание в разговорах",
    "Находите время для совместных занятий"
  ];

  return (
    <div className="flex gap-6">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg animate-fade-in space-y-6">
        {/* Общий результат */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-pacifico text-accent">
            {getCategoryEmoji(result.compatibilityType || 'good')} Результат вашей совместимости
          </h2>
          <div className="relative inline-block">
            <span className="text-4xl font-bold text-accent">
              {result.compatibility}%
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            {getCompatibilityDescription(result.compatibility)}
          </p>
        </div>

        {/* Группы категорий */}
        {Object.entries(categoryGroups).map(([key, group]) => (
          <div key={key} className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>{group.emoji}</span>
              {group.title}
            </h3>
            <Progress 
              value={
                group.categories.reduce((acc, cat) => 
                  acc + (result.categoryScores?.[cat] || 0), 0) / group.categories.length
              } 
              className="h-2"
            />
            <p className="text-sm text-gray-600">
              {group.getDescription(result.categoryScores || {})}
            </p>
          </div>
        ))}

        {/* Сильные стороны */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
            <span>💚</span> Ваши сильные стороны
          </h3>
          <div className="space-y-2">
            {result.categoryScores && (
              <>
                {result.categoryScores.emotional >= 70 && (
                  <div className="p-3 bg-green-50 rounded-lg text-green-700">
                    Вы отлично чувствуете эмоции друг друга
                  </div>
                )}
                {result.categoryScores.communication >= 70 && (
                  <div className="p-3 bg-green-50 rounded-lg text-green-700">
                    У вас хорошо развиты навыки общения
                  </div>
                )}
                {result.categoryScores.trust >= 70 && (
                  <div className="p-3 bg-green-50 rounded-lg text-green-700">
                    Между вами высокий уровень доверия
                  </div>
                )}
                {result.categoryScores.values >= 70 && (
                  <div className="p-3 bg-green-50 rounded-lg text-green-700">
                    Ваши жизненные ценности хорошо совпадают
                  </div>
                )}
                {result.categoryScores.future >= 70 && (
                  <div className="p-3 bg-green-50 rounded-lg text-green-700">
                    У вас схожее видение будущего
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Зоны роста */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
            <span>🌱</span> Зоны роста
          </h3>
          <div className="space-y-2">
            {result.categoryScores && (
              <>
                {result.categoryScores.emotional < 60 && (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
                    Старайтесь больше делиться своими чувствами
                  </div>
                )}
                {result.categoryScores.communication < 60 && (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
                    Уделите внимание качеству общения
                  </div>
                )}
                {result.categoryScores.trust < 60 && (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
                    Работайте над укреплением доверия
                  </div>
                )}
                {result.categoryScores.values < 60 && (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
                    Обсудите ваши жизненные приоритеты
                  </div>
                )}
                {result.categoryScores.future < 60 && (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
                    Поговорите о ваших планах на будущее
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Советы и рекомендации */}
        <div className="space-y-3">
          <Button
            onClick={() => setShowTips(!showTips)}
            className="w-full"
            variant="outline"
          >
            {showTips ? "Скрыть советы" : "Что я могу сделать?"}
          </Button>
          
          {showTips && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              {getTips().map((tip, index) => (
                <p key={index} className="text-sm flex items-start gap-2">
                  <span>•</span> {tip}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={onReset}
            className="w-full bg-secondary hover:bg-secondary-hover text-white"
          >
            Попробовать другой матч
          </Button>
          
          {!isPremium && (
            <Button
              variant="outline"
              className="w-full border-accent text-accent hover:bg-accent hover:text-white"
            >
              Получить расширенный анализ
            </Button>
          )}
        </div>
      </div>
      
      <div className="w-80 hidden lg:block sticky top-6 self-start">
        <FeedbackForm />
      </div>
    </div>
  );
};

export default CompatibilityResult;