import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CompatibilityResultProps {
  percentage: number;
  onReset: () => void;
}

const CompatibilityResult = ({ percentage, onReset }: CompatibilityResultProps) => {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-pacifico text-accent mb-4">Your Compatibility Score</h2>
      <div className="relative mb-6">
        <Progress value={percentage} className="h-4" />
        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-lg font-bold">
          {percentage}%
        </span>
      </div>
      <p className="text-lg mb-6 text-center">
        {percentage >= 80
          ? "Amazing match! Your stars are perfectly aligned! ✨"
          : percentage >= 60
          ? "Great potential! Your connection is promising! 🌟"
          : "There's room for growth in your relationship! 🌱"}
      </p>
      <Button
        onClick={onReset}
        className="w-full bg-secondary hover:bg-secondary-hover text-white"
      >
        Try Another Match
      </Button>
    </div>
  );
};

export default CompatibilityResult;