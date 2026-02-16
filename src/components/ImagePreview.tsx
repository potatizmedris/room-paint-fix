import { useState } from "react";
import { ArrowLeftRight, X, Download, Columns2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type ViewMode = "result" | "original" | "side-by-side";

interface ImagePreviewProps {
  originalImage: string;
  processedImage: string | null;
  onClear: () => void;
}

export function ImagePreview({ originalImage, processedImage, onClear }: ImagePreviewProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>("result");

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'wall-color-changed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const cycleMode = () => {
    if (viewMode === "result") setViewMode("original");
    else if (viewMode === "original") setViewMode("side-by-side");
    else setViewMode("result");
  };

  const getModeLabel = () => {
    if (viewMode === "result") return t("preview.showOriginal");
    if (viewMode === "original") return t("preview.sideBySide");
    return t("preview.showResult");
  };

  const getModeIcon = () => {
    if (viewMode === "original") return <Columns2 className="w-4 h-4" />;
    return <ArrowLeftRight className="w-4 h-4" />;
  };

  if (viewMode === "side-by-side" && processedImage) {
    return (
      <div className="space-y-4">
        <div className="relative image-container">
          <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-border">
            <div className="relative">
              <img src={originalImage} alt="Original" className="w-full h-auto object-cover max-h-[500px]" />
              <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground font-medium">
                {t("preview.original")}
              </span>
            </div>
            <div className="relative">
              <img src={processedImage} alt="New color" className="w-full h-auto object-cover max-h-[500px]" />
              <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground font-medium">
                {t("preview.newColor")}
              </span>
            </div>
          </div>
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            title={t("preview.clear")}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button
              onClick={cycleMode}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-background transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
              {t("preview.showResult")}
            </button>
          </div>
          <button
            onClick={handleDownload}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t("preview.download")}
          </button>
        </div>

        <div className="flex justify-center gap-2">
          {(["original", "result", "side-by-side"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                viewMode === mode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {mode === "original" ? t("preview.original") : mode === "result" ? t("preview.newColor") : t("preview.sideBySide")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const displayImage = viewMode === "original" ? originalImage : (processedImage || originalImage);

  return (
    <div className="space-y-4">
      <div className="relative image-container">
        <img
          src={displayImage}
          alt={viewMode === "original" ? "Original wall" : "Wall with new color"}
          className="w-full h-auto object-contain max-h-[500px]"
        />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          title={t("preview.clear")}
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {processedImage && (
          <>
            <div className="absolute bottom-3 left-3 flex gap-2">
              <button
                onClick={cycleMode}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-background transition-colors"
              >
                {getModeIcon()}
                {getModeLabel()}
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              {t("preview.download")}
            </button>
          </>
        )}
      </div>

      {processedImage && (
        <div className="flex justify-center gap-2">
          {(["original", "result", "side-by-side"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                viewMode === mode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {mode === "original" ? t("preview.original") : mode === "result" ? t("preview.newColor") : t("preview.sideBySide")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
