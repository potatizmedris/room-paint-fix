import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Camera, Upload, ImageIcon, AlertTriangle, Ruler } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export interface RoomSection {
  id: string;
  label: string;
  length: string;
  width: string;
}

export interface RoomMeasurementData {
  sections: RoomSection[];
  totalSquareMeters: number;
  floorPhoto: string | null;
  roomPhotos: string[];
}

interface RoomMeasurementProps {
  data: RoomMeasurementData;
  onChange: (data: RoomMeasurementData) => void;
}

const generateSectionId = () => `section-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

function calculateTotal(sections: RoomSection[]): number {
  return sections.reduce((total, section) => {
    const length = parseFloat(section.length) || 0;
    const width = parseFloat(section.width) || 0;
    return total + length * width;
  }, 0);
}

export function RoomMeasurement({ data, onChange }: RoomMeasurementProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const updateSections = useCallback(
    (newSections: RoomSection[]) => {
      onChange({ ...data, sections: newSections, totalSquareMeters: calculateTotal(newSections) });
    },
    [data, onChange]
  );

  const handleAddSection = () => {
    const sectionNumber = data.sections.length + 1;
    updateSections([...data.sections, { id: generateSectionId(), label: `${t("measurement.section")} ${sectionNumber}`, length: "", width: "" }]);
  };

  const handleRemoveSection = (id: string) => {
    if (data.sections.length <= 1) return;
    updateSections(data.sections.filter((s) => s.id !== id));
  };

  const handleSectionChange = (id: string, field: "length" | "width", value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, "");
    updateSections(data.sections.map((s) => (s.id === id ? { ...s, [field]: sanitized } : s)));
  };

  const processRoomPhotos = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArray.length === 0) return;
      const currentPhotos = data.roomPhotos || [];
      let loaded = 0;
      const newPhotos: string[] = [];
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPhotos.push(e.target?.result as string);
          loaded++;
          if (loaded === fileArray.length) {
            onChange({ ...data, roomPhotos: [...currentPhotos, ...newPhotos] });
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [data, onChange]
  );

  const handleRoomPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processRoomPhotos(files);
    e.target.value = "";
  };

  const handleRemoveRoomPhoto = (index: number) => {
    const updated = (data.roomPhotos || []).filter((_, i) => i !== index);
    onChange({ ...data, roomPhotos: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Ruler className="w-4 h-4 text-primary" />
        <Label className="text-base font-semibold">{t("measurement.title")}</Label>
      </div>

      <div className="space-y-3">
        {data.sections.map((section, index) => (
          <div key={section.id} className="flex items-end gap-2 p-3 rounded-lg bg-muted/40 border border-border">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                {data.sections.length > 1 ? `${t("measurement.section")} ${index + 1} — ${t("measurement.length")}` : t("measurement.length")}
              </Label>
              <Input type="text" inputMode="decimal" value={section.length} onChange={(e) => handleSectionChange(section.id, "length", e.target.value)} placeholder="e.g. 5.2" />
            </div>
            <span className="pb-2 text-muted-foreground font-medium">×</span>
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("measurement.width")}</Label>
              <Input type="text" inputMode="decimal" value={section.width} onChange={(e) => handleSectionChange(section.id, "width", e.target.value)} placeholder="e.g. 3.8" />
            </div>
            {data.sections.length > 1 && (
              <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveSection(section.id)} aria-label="Remove section">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={handleAddSection} className="gap-1.5 text-xs">
        <Plus className="w-3.5 h-3.5" />
        {t("measurement.addSection")}
      </Button>

      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-sm font-medium text-foreground">{t("measurement.estimatedTotal")}</span>
        <span className="text-lg font-bold text-primary">
          {data.totalSquareMeters > 0 ? `${data.totalSquareMeters.toFixed(1)} m²` : "— m²"}
        </span>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">{t("measurement.roomPhotos")}</Label>
        <p className="text-xs text-muted-foreground">{t("measurement.roomPhotosDesc")}</p>

        {(data.roomPhotos || []).length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {data.roomPhotos.map((photo, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden border border-border group">
                <img src={photo} alt={`Room ${index + 1}`} className="w-full h-24 object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveRoomPhoto(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1.5 flex-1" onClick={() => cameraInputRef.current?.click()}>
            <Camera className="w-4 h-4" />
            {t("measurement.takePhoto")}
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-1.5 flex-1" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" />
            {t("measurement.upload")}
          </Button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleRoomPhotoChange} className="hidden" />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleRoomPhotoChange} className="hidden" />
      </div>

      <Alert className="border-destructive/30 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-xs text-muted-foreground">
          <strong className="text-foreground">{t("measurement.disclaimer")}</strong> {t("measurement.disclaimerText")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
