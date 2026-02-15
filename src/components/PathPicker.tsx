import { FileText, Sparkles } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { UserMenu } from "@/components/UserMenu";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

export type UserPath = "direct-offer" | "inspiration";

interface PathPickerProps {
  onSelectPath: (path: UserPath) => void;
  onBack: () => void;
}

export function PathPicker({ onSelectPath, onBack }: PathPickerProps) {
  const { t } = useLanguage();

  const pathOptions = [
    {
      id: "direct-offer" as UserPath,
      title: t("path.directOffer"),
      description: t("path.directOfferDesc"),
      icon: <FileText className="w-8 h-8" />,
    },
    {
      id: "inspiration" as UserPath,
      title: t("path.inspiration"),
      description: t("path.inspirationDesc"),
      icon: <Sparkles className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BackButton onClick={onBack} />
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-3">
              {t("path.title")}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("path.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pathOptions.map((option) => (
              <Card 
                key={option.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
                onClick={() => onSelectPath(option.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                    <span className="text-secondary-foreground transition-colors group-hover:text-primary">
                      {option.icon}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg text-foreground mb-2 transition-colors group-hover:text-primary">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
