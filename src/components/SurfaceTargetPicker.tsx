import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type SurfaceTarget = "walls" | "ceiling" | "both";

interface SurfaceTargetPickerProps {
  selectedTarget: SurfaceTarget;
  onTargetChange: (target: SurfaceTarget) => void;
  disabled?: boolean;
}

const SURFACE_OPTIONS: { value: SurfaceTarget; label: string }[] = [
  { value: "walls", label: "Walls" },
  { value: "ceiling", label: "Ceiling" },
  { value: "both", label: "Both" },
];

export function SurfaceTargetPicker({
  selectedTarget,
  onTargetChange,
  disabled,
}: SurfaceTargetPickerProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">Apply color to:</h4>
      <RadioGroup
        value={selectedTarget}
        onValueChange={(value) => onTargetChange(value as SurfaceTarget)}
        disabled={disabled}
        className="flex flex-wrap gap-4"
      >
        {SURFACE_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`surface-${option.value}`}
            />
            <Label
              htmlFor={`surface-${option.value}`}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
