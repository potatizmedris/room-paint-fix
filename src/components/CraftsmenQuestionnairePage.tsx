import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hammer, ArrowRight, Lock } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { MultiRoomMeasurement, type MultiRoomMeasurementData } from "@/components/MultiRoomMeasurement";
import { ProjectDetailsFields, defaultProjectDetails, type ProjectDetails } from "@/components/ProjectDetailsFields";
import { QuoteResult } from "@/components/QuoteResult";
import { calculateQuote, type QuoteInput, type QuoteOutput } from "@/lib/calculateQuote";
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

interface PricingFields {
  ceilingAreaM2: string;
  scope: "Väggar" | "Väggar+Tak";
  zone: "Zon A" | "Zon B" | "Zon C";
  substrate: "Målad vägg (gips/puts)" | "Tapet" | "Betong/tegel" | "Träpanel";
  wallpaperAction: "Måla på" | "Tapet bort";
  condition: "Bra" | "Normal" | "Dåligt";
  furnishing: "Tomt" | "Halvmöblerat" | "Fullt";
  colorChange: "Ljust→ljust" | "Mörkt→ljust" | "Ljust→mörkt" | "Uppfräschning";
  coats: "Auto" | "1" | "2" | "3";
  quality: "Budget" | "Standard" | "Premium";
  materialProvidedBy: "Målare" | "Kund";
  rotEnabled: "Ja" | "Nej";
  rotPercent: string;
}

const defaultPricing: PricingFields = {
  ceilingAreaM2: "0",
  scope: "Väggar",
  zone: "Zon A",
  substrate: "Målad vägg (gips/puts)",
  wallpaperAction: "Måla på",
  condition: "Normal",
  furnishing: "Halvmöblerat",
  colorChange: "Ljust→ljust",
  coats: "Auto",
  quality: "Standard",
  materialProvidedBy: "Målare",
  rotEnabled: "Nej",
  rotPercent: "0.30",
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

export function CraftsmenQuestionnairePage({ projectType, onBack, onComplete }: CraftsmenQuestionnairePageProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteOutput | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postalCode: "", projectDescription: "",
  });
  const [pricing, setPricing] = useState<PricingFields>(defaultPricing);
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
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>(defaultProjectDetails);

  const projectTypeLabel = t(`project.${projectType}`);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePricing = (partial: Partial<PricingFields>) => {
    setPricing((prev) => ({ ...prev, ...partial }));
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

    const ceilingHeight = parseFloat(projectDetails.ceilingHeight) || 2.4;

    const quoteInput: QuoteInput = {
      wallsAreaM2: measurement.grandTotalSquareMeters,
      ceilingAreaM2: parseFloat(pricing.ceilingAreaM2) || 0,
      ceilingHeightM: ceilingHeight,
      scope: pricing.scope,
      zone: pricing.zone,
      substrate: pricing.substrate,
      wallpaperAction: pricing.wallpaperAction,
      condition: pricing.condition,
      furnishing: pricing.furnishing,
      colorChange: pricing.colorChange,
      coats: pricing.coats,
      quality: pricing.quality,
      materialProvidedBy: pricing.materialProvidedBy,
      rotEnabled: pricing.rotEnabled,
      rotPercent: Math.min(0.3, Math.max(0, parseFloat(pricing.rotPercent) || 0)),
    };

    const result = calculateQuote(quoteInput);
    setQuoteResult(result);
  };

  // Show quote result
  if (quoteResult) {
    return (
      <QuoteResult
        quote={quoteResult}
        onBack={() => setQuoteResult(null)}
        onComplete={onComplete}
      />
    );
  }

  // Auth gate
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <BackButton onClick={onBack} />
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Lock className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {t("craftsmen.loginRequired")}
                </h2>
                <p className="text-muted-foreground">
                  {t("craftsmen.loginRequiredDesc")}
                </p>
              </div>
              <Button onClick={() => setAuthDialogOpen(true)} className="gap-2">
                {t("menu.signIn")}
              </Button>
            </CardContent>
          </Card>
        </main>
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
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
                {/* Contact info */}
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

                {/* Room measurements */}
                {projectType === "painting" && (
                  <div className="border-t border-border pt-4">
                    <MultiRoomMeasurement data={measurement} onChange={setMeasurement} />
                  </div>
                )}

                {/* Project details */}
                {projectType === "painting" && (
                  <div className="border-t border-border pt-4">
                    <Label className="text-base font-semibold mb-3 block">{t("details.sectionTitle")}</Label>
                    <ProjectDetailsFields
                      data={projectDetails}
                      onChange={setProjectDetails}
                      hideColorCode={false}
                      availableRooms={measurement.rooms.map((r, i) => ({ id: r.id, label: `${t("measurement.room")} ${i + 1}` }))}
                    />
                  </div>
                )}

                {/* Pricing fields */}
                {projectType === "painting" && (
                  <div className="border-t border-border pt-4 space-y-4">
                    <Label className="text-base font-semibold block">{t("pricing.sectionTitle")}</Label>

                    {/* Zone */}
                    <div className="space-y-2">
                      <Label>{t("pricing.zone")}</Label>
                      <Select value={pricing.zone} onValueChange={(v) => updatePricing({ zone: v as PricingFields["zone"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Zon A">Zon A</SelectItem>
                          <SelectItem value="Zon B">Zon B</SelectItem>
                          <SelectItem value="Zon C">Zon C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Scope */}
                    <div className="space-y-2">
                      <Label>{t("pricing.scope")}</Label>
                      <Select value={pricing.scope} onValueChange={(v) => updatePricing({ scope: v as PricingFields["scope"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Väggar">{t("pricing.scopeWalls")}</SelectItem>
                          <SelectItem value="Väggar+Tak">{t("pricing.scopeWallsCeiling")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ceiling area (only if scope includes ceiling) */}
                    {pricing.scope === "Väggar+Tak" && (
                      <div className="space-y-2">
                        <Label>{t("pricing.ceilingArea")}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={pricing.ceilingAreaM2}
                          onChange={(e) => updatePricing({ ceilingAreaM2: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    )}

                    {/* Substrate */}
                    <div className="space-y-2">
                      <Label>{t("pricing.substrate")}</Label>
                      <Select value={pricing.substrate} onValueChange={(v) => updatePricing({ substrate: v as PricingFields["substrate"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Målad vägg (gips/puts)">{t("pricing.substratePainted")}</SelectItem>
                          <SelectItem value="Tapet">{t("pricing.substrateWallpaper")}</SelectItem>
                          <SelectItem value="Betong/tegel">{t("pricing.substrateConcrete")}</SelectItem>
                          <SelectItem value="Träpanel">{t("pricing.substrateWood")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wallpaper action */}
                    {pricing.substrate === "Tapet" && (
                      <div className="space-y-2">
                        <Label>{t("pricing.wallpaperAction")}</Label>
                        <Select value={pricing.wallpaperAction} onValueChange={(v) => updatePricing({ wallpaperAction: v as PricingFields["wallpaperAction"] })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Måla på">{t("pricing.paintOver")}</SelectItem>
                            <SelectItem value="Tapet bort">{t("pricing.removeWallpaper")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Condition */}
                    <div className="space-y-2">
                      <Label>{t("pricing.condition")}</Label>
                      <Select value={pricing.condition} onValueChange={(v) => updatePricing({ condition: v as PricingFields["condition"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bra">{t("pricing.conditionGood")}</SelectItem>
                          <SelectItem value="Normal">{t("pricing.conditionNormal")}</SelectItem>
                          <SelectItem value="Dåligt">{t("pricing.conditionBad")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Furnishing */}
                    <div className="space-y-2">
                      <Label>{t("pricing.furnishing")}</Label>
                      <Select value={pricing.furnishing} onValueChange={(v) => updatePricing({ furnishing: v as PricingFields["furnishing"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tomt">{t("pricing.furnishingEmpty")}</SelectItem>
                          <SelectItem value="Halvmöblerat">{t("pricing.furnishingHalf")}</SelectItem>
                          <SelectItem value="Fullt">{t("pricing.furnishingFull")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color change */}
                    <div className="space-y-2">
                      <Label>{t("pricing.colorChange")}</Label>
                      <Select value={pricing.colorChange} onValueChange={(v) => updatePricing({ colorChange: v as PricingFields["colorChange"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ljust→ljust">{t("pricing.lightToLight")}</SelectItem>
                          <SelectItem value="Mörkt→ljust">{t("pricing.darkToLight")}</SelectItem>
                          <SelectItem value="Ljust→mörkt">{t("pricing.lightToDark")}</SelectItem>
                          <SelectItem value="Uppfräschning">{t("pricing.refresh")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Number of coats */}
                    <div className="space-y-2">
                      <Label>{t("pricing.coats")}</Label>
                      <Select value={pricing.coats} onValueChange={(v) => updatePricing({ coats: v as PricingFields["coats"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Auto">{t("pricing.coatsAuto")}</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quality */}
                    <div className="space-y-2">
                      <Label>{t("pricing.quality")}</Label>
                      <Select value={pricing.quality} onValueChange={(v) => updatePricing({ quality: v as PricingFields["quality"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Budget">Budget</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Material provided by */}
                    <div className="space-y-2">
                      <Label>{t("pricing.materialBy")}</Label>
                      <Select value={pricing.materialProvidedBy} onValueChange={(v) => updatePricing({ materialProvidedBy: v as PricingFields["materialProvidedBy"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Målare">{t("pricing.materialPainter")}</SelectItem>
                          <SelectItem value="Kund">{t("pricing.materialCustomer")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ROT */}
                    <div className="space-y-2">
                      <Label>{t("pricing.rot")}</Label>
                      <Select value={pricing.rotEnabled} onValueChange={(v) => updatePricing({ rotEnabled: v as PricingFields["rotEnabled"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ja">{t("pricing.rotYes")}</SelectItem>
                          <SelectItem value="Nej">{t("pricing.rotNo")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {pricing.rotEnabled === "Ja" && (
                      <div className="space-y-2">
                        <Label>{t("pricing.rotPercent")}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="0.30"
                          step="0.01"
                          value={pricing.rotPercent}
                          onChange={(e) => updatePricing({ rotPercent: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">{t("pricing.rotPercentHint")}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">{t("craftsmen.projectDescription")}</Label>
                  <Textarea id="projectDescription" value={formData.projectDescription} onChange={(e) => handleInputChange("projectDescription", e.target.value)} placeholder={t("craftsmen.tellUs")} rows={4} />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full gap-2">
                    {t("pricing.calculate")}
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
