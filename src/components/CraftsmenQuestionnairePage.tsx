import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Hammer, ArrowRight, CheckCircle2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { MultiRoomMeasurement, type MultiRoomMeasurementData } from "@/components/MultiRoomMeasurement";
import type { ProjectType } from "@/components/ProjectTypePicker";

interface CraftsmenQuestionnairePageProps {
  projectType: ProjectType;
  onBack: () => void;
  onComplete: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  projectDescription: string;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

export function CraftsmenQuestionnairePage({ projectType, onBack, onComplete }: CraftsmenQuestionnairePageProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postalCode: "", projectDescription: "",
  });
  const [measurement, setMeasurement] = useState<MultiRoomMeasurementData>({
    rooms: [{
      id: generateId(),
      label: `${t("measurement.room")} 1`,
      photo: null,
      sections: [{ id: generateId(), label: `${t("measurement.section")} 1`, length: "", width: "" }],
      totalSquareMeters: 0,
    }],
    grandTotalSquareMeters: 0,
  });

  const projectTypeLabel = t(`project.${projectType}`);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({ title: t("craftsmen.missingInfo"), description: t("craftsmen.fillRequired"), variant: "destructive" });
      return;
    }
    if (projectType === "painting" && measurement.grandTotalSquareMeters <= 0) {
      toast({ title: t("craftsmen.measurementsRequired"), description: t("craftsmen.enterDimensions"), variant: "destructive" });
      return;
    }
    console.log("Form submitted:", { ...formData, projectType, measurement });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-semibold text-foreground">{t("craftsmen.thankYou")}</h2>
                <p className="text-muted-foreground">
                  {t("craftsmen.submitted")} {projectTypeLabel.toLowerCase()}.
                </p>
              </div>
              <Button onClick={onComplete} className="mt-4">{t("craftsmen.backToHome")}</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <BackButton onClick={onBack} />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center">
              <Hammer className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
              {t("craftsmen.getQuote")} {projectTypeLabel}
            </h1>
            <p className="text-muted-foreground">{t("craftsmen.fillDetails")}</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("craftsmen.firstName")} *</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("craftsmen.lastName")} *</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("craftsmen.email")} *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("craftsmen.phone")} *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+46 70 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t("craftsmen.streetAddress")}</Label>
                  <Input id="address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("craftsmen.city")}</Label>
                    <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t("craftsmen.postalCode")}</Label>
                    <Input id="postalCode" value={formData.postalCode} onChange={(e) => handleInputChange("postalCode", e.target.value)} />
                  </div>
                </div>
                {projectType === "painting" && (
                  <div className="border-t border-border pt-4">
                    <MultiRoomMeasurement data={measurement} onChange={setMeasurement} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">{t("craftsmen.projectDescription")}</Label>
                  <Textarea id="projectDescription" value={formData.projectDescription} onChange={(e) => handleInputChange("projectDescription", e.target.value)} placeholder={t("craftsmen.tellUs")} rows={4} />
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full gap-2">
                    {t("craftsmen.submitRequest")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">{t("craftsmen.bySubmitting")}</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
