import { BackButton } from "@/components/BackButton";
import { BookOpen, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AboutHemfix() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <BackButton onClick={() => navigate(-1)} />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
              {t("menu.aboutHemfix")}
            </h1>
          </div>
          <Alert className="border-dashed border-primary/40 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-muted-foreground text-sm">
              <strong className="text-foreground">Påminnelse:</strong> Här ska vi skriva in vad man som användare kan förvänta sig genom att använda vår app – funktioner, fördelar och vad HemFix erbjuder.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
}
