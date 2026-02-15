import { Paintbrush, Wrench, HardHat, Grid3X3, Hammer, Lightbulb, Lock } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { UserMenu } from "@/components/UserMenu";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

export type ProjectType = 
  | "painting" 
  | "plumbing" 
  | "construction" 
  | "flooring" 
  | "carpentry" 
  | "electrical";

interface ProjectTypePickerProps {
  onSelectProject: (projectType: ProjectType) => void;
  onBack: () => void;
}

export function ProjectTypePicker({ onSelectProject, onBack }: ProjectTypePickerProps) {
  const { t } = useLanguage();

  const projectOptions = [
    { id: "painting" as ProjectType, titleKey: "project.painting", descKey: "project.paintingDesc", icon: <Paintbrush className="w-8 h-8" />, available: true },
    { id: "plumbing" as ProjectType, titleKey: "project.plumbing", descKey: "project.plumbingDesc", icon: <Wrench className="w-8 h-8" />, available: false },
    { id: "construction" as ProjectType, titleKey: "project.construction", descKey: "project.constructionDesc", icon: <HardHat className="w-8 h-8" />, available: false },
    { id: "flooring" as ProjectType, titleKey: "project.flooring", descKey: "project.flooringDesc", icon: <Grid3X3 className="w-8 h-8" />, available: false },
    { id: "carpentry" as ProjectType, titleKey: "project.carpentry", descKey: "project.carpentryDesc", icon: <Hammer className="w-8 h-8" />, available: false },
    { id: "electrical" as ProjectType, titleKey: "project.electrical", descKey: "project.electricalDesc", icon: <Lightbulb className="w-8 h-8" />, available: false },
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

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-3">
              {t("project.title")}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("project.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectOptions.map((project) => (
              <Card 
                key={project.id}
                className={`group transition-all duration-200 ${
                  project.available 
                    ? "cursor-pointer hover:shadow-lg hover:border-primary/50 hover:-translate-y-1" 
                    : "cursor-not-allowed opacity-60"
                }`}
                onClick={() => project.available && onSelectProject(project.id)}
              >
                <CardContent className="p-6 text-center relative">
                  {!project.available && (
                    <div className="absolute top-3 right-3">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${
                    project.available ? "bg-secondary group-hover:bg-primary/10" : "bg-muted"
                  }`}>
                    <span className={`transition-colors ${
                      project.available ? "text-secondary-foreground group-hover:text-primary" : "text-muted-foreground"
                    }`}>
                      {project.icon}
                    </span>
                  </div>
                  <h3 className={`font-medium mb-1 transition-colors ${
                    project.available ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                  }`}>
                    {t(project.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(project.descKey)}
                  </p>
                  {!project.available && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {t("project.comingSoon")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
