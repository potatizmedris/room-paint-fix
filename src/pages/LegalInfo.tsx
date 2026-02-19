import { BackButton } from "@/components/BackButton";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Shield, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LegalInfo() {
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
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center">
              <Info className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
              {t("menu.legalInfo")}
            </h1>
          </div>

          <div className="space-y-3">
            <Link to="/privacy">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="py-4 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0" />
                  <span className="flex-1 font-medium text-foreground">{t("menu.privacyPolicy")}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
