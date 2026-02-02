import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type SurfaceTarget = "walls" | "floor" | "ceiling";

interface SurfaceTargetPickerProps {
  selectedTargets: SurfaceTarget[];
  onTargetsChange: (targets: SurfaceTarget[]) => void;
  disabled?: boolean;
}

const SURFACE_OPTIONS: { value: SurfaceTarget; label: string }[] = [
  { value: "walls", label: "Walls" },
  { value: "floor", label: "Floor" },
  { value: "ceiling", label: "Ceiling" },
];

export function SurfaceTargetPicker({
  selectedTargets,
  onTargetsChange,
  disabled,
}: SurfaceTargetPickerProps) {
  const handleToggle = (target: SurfaceTarget, checked: boolean) => {
    if (checked) {
      onTargetsChange([...selectedTargets, target]);
    } else {
      // Ensure at least one target is always selected
      if (selectedTargets.length > 1) {
        onTargetsChange(selectedTargets.filter((t) => t !== target));
      }
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">Apply color to:</h4>
      <div className="flex flex-wrap gap-4">
        {SURFACE_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`surface-${option.value}`}
              checked={selectedTargets.includes(option.value)}
              onCheckedChange={(checked) =>
                handleToggle(option.value, checked as boolean)
              }
              disabled={disabled}
            />
            <Label
              htmlFor={`surface-${option.value}`}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
