import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Hammer, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { RoomMeasurement, type RoomMeasurementData } from "@/components/RoomMeasurement";

interface CraftsmenQuestionnaireProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; postalCode: string; projectDescription: string;
}

export function CraftsmenQuestionnaire({ open, onOpenChange }: CraftsmenQuestionnaireProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postalCode: "", projectDescription: "",
  });
  const [roomMeasurement, setRoomMeasurement] = useState<RoomMeasurementData>({
    sections: [{ id: "initial", label: `${t("measurement.section")} 1`, length: "", width: "" }],
    totalSquareMeters: 0,
    floorPhoto: null,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({ title: t("craftsmen.missingInfo"), description: t("craftsmen.fillRequired"), variant: "destructive" });
      return;
    }
    if (roomMeasurement.totalSquareMeters <= 0) {
      toast({ title: t("craftsmen.measurementsRequired"), description: t("craftsmen.enterDimensions"), variant: "destructive" });
      return;
    }
    console.log("Form submitted:", { ...formData, roomMeasurement });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postalCode: "", projectDescription: "" });
      setRoomMeasurement({ sections: [{ id: "initial", label: `${t("measurement.section")} 1`, length: "", width: "" }], totalSquareMeters: 0, floorPhoto: null });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center">{t("craftsmenDialog.thankYou")}</DialogTitle>
              <DialogDescription className="text-center">{t("craftsmenDialog.submitted")}</DialogDescription>
            </DialogHeader>
            <Button onClick={handleClose} className="mt-4">{t("craftsmenDialog.close")}</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Hammer className="w-5 h-5 text-primary-foreground" />
                </div>
                <DialogTitle>{t("craftsmenDialog.findCraftsman")}</DialogTitle>
              </div>
              <DialogDescription>{t("craftsmenDialog.fillDetailsDialog")}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              <div className="border-t border-border pt-4">
                <RoomMeasurement data={roomMeasurement} onChange={setRoomMeasurement} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">{t("craftsmen.projectDescription")}</Label>
                <Textarea id="projectDescription" value={formData.projectDescription} onChange={(e) => handleInputChange("projectDescription", e.target.value)} placeholder={t("craftsmenDialog.tellUs")} rows={3} />
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full gap-2">
                  {t("craftsmen.submitRequest")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">{t("craftsmen.bySubmitting")}</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
