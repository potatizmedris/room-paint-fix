import { Paintbrush, Wrench, HardHat, Grid3X3, Hammer, Lightbulb, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ProjectType = 
  | "painting" 
  | "plumbing" 
  | "construction" 
  | "flooring" 
  | "carpentry" 
  | "electrical";

interface ProjectOption {
  id: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

const projectOptions: ProjectOption[] = [
  {
    id: "painting",
    title: "Painting Work",
    description: "Wall painting, interior & exterior",
    icon: <Paintbrush className="w-8 h-8" />,
    available: true,
  },
  {
    id: "plumbing",
    title: "Plumbing",
    description: "Pipes, fixtures & installations",
    icon: <Wrench className="w-8 h-8" />,
    available: false,
  },
  {
    id: "construction",
    title: "Construction",
    description: "Building & renovation projects",
    icon: <HardHat className="w-8 h-8" />,
    available: false,
  },
  {
    id: "flooring",
    title: "Floor Laying",
    description: "Tiles, hardwood & laminate",
    icon: <Grid3X3 className="w-8 h-8" />,
    available: false,
  },
  {
    id: "carpentry",
    title: "Carpentry",
    description: "Custom woodwork & furniture",
    icon: <Hammer className="w-8 h-8" />,
    available: false,
  },
  {
    id: "electrical",
    title: "Electrical",
    description: "Wiring, lighting & outlets",
    icon: <Lightbulb className="w-8 h-8" />,
    available: false,
  },
];

interface ProjectTypePickerProps {
  onSelectProject: (projectType: ProjectType) => void;
  onBack: () => void;
}

export function ProjectTypePicker({ onSelectProject, onBack }: ProjectTypePickerProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-3">
              What would you like to work on?
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select your project type and we'll help you visualize and connect with the right professionals
            </p>
          </div>

          {/* Project Grid */}
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
                  {/* Lock overlay for unavailable options */}
                  {!project.available && (
                    <div className="absolute top-3 right-3">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${
                    project.available 
                      ? "bg-secondary group-hover:bg-primary/10" 
                      : "bg-muted"
                  }`}>
                    <span className={`transition-colors ${
                      project.available 
                        ? "text-secondary-foreground group-hover:text-primary" 
                        : "text-muted-foreground"
                    }`}>
                      {project.icon}
                    </span>
                  </div>
                  <h3 className={`font-medium mb-1 transition-colors ${
                    project.available 
                      ? "text-foreground group-hover:text-primary" 
                      : "text-muted-foreground"
                  }`}>
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  {!project.available && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Coming soon
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
