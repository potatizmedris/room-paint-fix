import { Paintbrush } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ProcessingOverlayProps {
  colorName?: string;
}

export function ProcessingOverlay({ colorName }: ProcessingOverlayProps) {
  const { t } = useLanguage();

  return (
    <div className="processing-overlay rounded-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-subtle">
            <Paintbrush className="w-10 h-10 text-primary animate-spin-slow" />
          </div>
        </div>
        <div className="text-center">
          <p className="font-serif text-lg font-medium text-foreground">{t("processing.painting")}</p>
          {colorName && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("processing.applying")} {colorName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
