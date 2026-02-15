import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageContext";

export type SurfaceTarget = "walls" | "ceiling" | "both";

interface SurfaceTargetPickerProps {
  selectedTarget: SurfaceTarget;
  onTargetChange: (target: SurfaceTarget) => void;
  disabled?: boolean;
}

export function SurfaceTargetPicker({ selectedTarget, onTargetChange, disabled }: SurfaceTargetPickerProps) {
  const { t } = useLanguage();

  const SURFACE_OPTIONS: { value: SurfaceTarget; labelKey: string }[] = [
    { value: "walls", labelKey: "surface.walls" },
    { value: "ceiling", labelKey: "surface.ceiling" },
    { value: "both", labelKey: "surface.both" },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">{t("surface.applyTo")}</h4>
      <RadioGroup
        value={selectedTarget}
        onValueChange={(value) => onTargetChange(value as SurfaceTarget)}
        disabled={disabled}
        className="flex flex-wrap gap-4"
      >
        {SURFACE_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`surface-${option.value}`} />
            <Label htmlFor={`surface-${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
              {t(option.labelKey)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
