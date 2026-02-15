import { useState } from "react";
import { ArrowLeftRight, X, Download } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ImagePreviewProps {
  originalImage: string;
  processedImage: string | null;
  onClear: () => void;
}

export function ImagePreview({ originalImage, processedImage, onClear }: ImagePreviewProps) {
  const { t } = useLanguage();
  const [showOriginal, setShowOriginal] = useState(false);
  const displayImage = showOriginal ? originalImage : (processedImage || originalImage);

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

  return (
    <div className="space-y-4">
      <div className="relative image-container">
        <img
          src={displayImage}
          alt={showOriginal ? "Original wall" : "Wall with new color"}
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
                onClick={() => setShowOriginal(!showOriginal)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-background transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
                {showOriginal ? t("preview.showResult") : t("preview.showOriginal")}
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
          <span className={`text-xs px-3 py-1 rounded-full transition-colors ${
            showOriginal ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {t("preview.original")}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full transition-colors ${
            !showOriginal ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {t("preview.newColor")}
          </span>
        </div>
      )}
    </div>
  );
}
