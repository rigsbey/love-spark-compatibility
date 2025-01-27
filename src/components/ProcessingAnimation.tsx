import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProcessingAnimationProps {
  onComplete: () => void;
}

const ProcessingAnimation = ({ onComplete }: ProcessingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    { text: "Обрабатываем ваши данные...", target: 25 },
    { text: "Сравниваем предпочтения...", target: 50 },
    { text: "Вычисляем уровень совместимости...", target: 75 },
    { text: "Формируем рекомендации для вашей пары...", target: 100 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        const currentStage = stages[stage];
        if (prev >= currentStage.target) {
          setStage(s => Math.min(s + 1, stages.length - 1));
        }
        
        return Math.min(prev + 1, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [stage, onComplete]);

  return (
    <div className="w-full space-y-6 p-8">
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-3 bg-gray-100"
        />
        <div className="absolute -top-2 left-0 w-full">
          <div 
            className="relative h-7"
            style={{ left: `${progress}%` }}
          >
            <span className="absolute -translate-x-1/2 animate-bounce">
              ❤️
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-8">
        {stages.map((s, index) => (
          <p
            key={index}
            className={cn(
              "absolute w-full text-center transition-all duration-500",
              stage === index 
                ? "opacity-100 transform translate-y-0" 
                : "opacity-0 transform translate-y-4"
            )}
          >
            {s.text}
          </p>
        ))}
      </div>

      <div className="flex justify-center space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              "animate-pulse",
              "bg-accent/60"
            )}
            style={{
              animationDelay: `${i * 200}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessingAnimation; 