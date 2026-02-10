import { UserPlus, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import heroImage from "@/assets/hero-image.png";

interface StartScreenProps {
  onContinueAsGuest: () => void;
  onCreateAccount: () => void;
  onLogin?: () => void;
}

export function StartScreen({ onContinueAsGuest, onCreateAccount, onLogin }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 relative">
      {/* Account menu in upper right */}
      <div className="absolute top-4 right-4 z-10">
        <UserMenu />
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
          SnapNFix
        </h1>
        <p className="text-muted-foreground mb-10">
          Visualize your perfect home with AI-powered room transformation and realize your project directly by choosing from well-trusted craftsmen
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={onLogin}
          >
            <LogIn className="w-5 h-5" />
            Log In
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full gap-2"
            onClick={onCreateAccount}
          >
            <UserPlus className="w-5 h-5" />
            Create an Account
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={onContinueAsGuest}
          >
            Continue as Guest
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Create an account to save your favorite colors and access them anytime
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Save favorites
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Sync across devices
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
