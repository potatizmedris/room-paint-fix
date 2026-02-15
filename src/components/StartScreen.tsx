import { UserPlus, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImage from "@/assets/hero-image.png";

interface StartScreenProps {
  onContinueAsGuest: () => void;
  onCreateAccount: () => void;
  onLogin?: () => void;
}

export function StartScreen({ onContinueAsGuest, onCreateAccount, onLogin }: StartScreenProps) {
  const { t } = useLanguage();

  const handleOAuth = async (provider: "google" | "apple") => {
    await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Hero Image */}
        <div className="mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={heroImage}
            alt="Before and after wall color transformation"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl font-semibold text-foreground mb-3">
          {t("start.title")}
        </h1>
        <p className="text-muted-foreground mb-10">
          {t("start.subtitle")}
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button size="lg" className="w-full gap-2" onClick={() => handleOAuth("google")} variant="outline">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {t("start.continueWithGoogle")}
          </Button>

          <Button size="lg" className="w-full gap-2" onClick={() => handleOAuth("apple")} variant="outline">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            {t("start.continueWithApple")}
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">{t("start.or")}</span></div>
          </div>

          <Button size="lg" className="w-full gap-2" onClick={onLogin}>
            <LogIn className="w-5 h-5" />
            {t("start.loginEmail")}
          </Button>

          <Button variant="secondary" size="lg" className="w-full gap-2" onClick={onCreateAccount}>
            <UserPlus className="w-5 h-5" />
            {t("start.createAccount")}
          </Button>

          <Button variant="ghost" size="lg" className="w-full gap-2" onClick={onContinueAsGuest}>
            {t("start.continueAsGuest")}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            {t("start.accountHint")}
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {t("start.saveFavorites")}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {t("start.syncDevices")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
