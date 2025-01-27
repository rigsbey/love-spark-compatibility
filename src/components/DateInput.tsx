import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DateInput = ({ label, value, onChange }: DateInputProps) => {
  return (
    <div className="w-full max-w-sm">
      <Label className="text-accent text-lg mb-2">{label}</Label>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-accent"
      />
    </div>
  );
};

export default DateInput;