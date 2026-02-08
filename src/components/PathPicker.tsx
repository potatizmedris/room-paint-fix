import { FileText, Sparkles } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type UserPath = "direct-offer" | "inspiration";

interface PathOption {
  id: UserPath;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const pathOptions: PathOption[] = [
  {
    id: "direct-offer",
    title: "Get an Offer Directly",
    description: "I already know what I need fixed",
    icon: <FileText className="w-8 h-8" />,
  },
  {
    id: "inspiration",
    title: "Get Inspiration",
    description: "Explore options with our AI tool",
    icon: <Sparkles className="w-8 h-8" />,
  },
];

interface PathPickerProps {
  onSelectPath: (path: UserPath) => void;
  onBack: () => void;
}

export function PathPicker({ onSelectPath, onBack }: PathPickerProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <BackButton onClick={onBack} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-3">
              How can we help you?
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose how you'd like to proceed with your project
            </p>
          </div>

          {/* Path Options */}
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
