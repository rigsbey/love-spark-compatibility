import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendFeedbackEmail } from '@/services/emailService';
import { useToast } from "@/components/ui/use-toast";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Пожалуйста, напишите ваш отзыв",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    const success = await sendFeedbackEmail(feedback);
    setIsSending(false);

    if (success) {
      toast({
        title: "Спасибо за ваш отзыв!",
        description: "Мы ценим ваше мнение.",
      });
      setFeedback('');
    } else {
      toast({
        title: "Не удалось отправить отзыв",
        description: "Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm space-y-3">
      <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
        <span>💌</span> Поделитесь мнением
      </h3>
      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Что можно улучшить?"
        className="min-h-[100px] resize-none"
      />
      <Button
        onClick={handleSubmit}
        disabled={isSending}
        className="w-full bg-accent hover:bg-accent/90 text-white"
      >
        {isSending ? "Отправка..." : "Отправить отзыв"}
      </Button>
    </div>
  );
};

export default FeedbackForm; 