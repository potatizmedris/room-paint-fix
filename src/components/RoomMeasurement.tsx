import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Camera, Upload, ImageIcon, AlertTriangle, Ruler } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const updateSections = useCallback(
    (newSections: RoomSection[]) => {
      onChange({
        ...data,
        sections: newSections,
        totalSquareMeters: calculateTotal(newSections),
      });
    },
    [data, onChange]
  );

  const handleAddSection = () => {
    const sectionNumber = data.sections.length + 1;
    const newSection: RoomSection = {
      id: generateSectionId(),
      label: `Section ${sectionNumber}`,
      length: "",
      width: "",
    };
    updateSections([...data.sections, newSection]);
  };

  const handleRemoveSection = (id: string) => {
    if (data.sections.length <= 1) return;
    updateSections(data.sections.filter((s) => s.id !== id));
  };

  const handleSectionChange = (id: string, field: "length" | "width", value: string) => {
    // Allow only numbers and decimal points
    const sanitized = value.replace(/[^0-9.]/g, "");
    updateSections(
      data.sections.map((s) => (s.id === id ? { ...s, [field]: sanitized } : s))
    );
  };

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({ ...data, floorPhoto: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    },
    [data, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemovePhoto = () => {
    onChange({ ...data, floorPhoto: null });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Ruler className="w-4 h-4 text-primary" />
        <Label className="text-base font-semibold">Room Measurements</Label>
      </div>

      {/* Dimension sections */}
      <div className="space-y-3">
        {data.sections.map((section, index) => (
          <div
            key={section.id}
            className="flex items-end gap-2 p-3 rounded-lg bg-muted/40 border border-border"
          >
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                {data.sections.length > 1 ? `Section ${index + 1} — Length (m)` : "Length (m)"}
              </Label>
              <Input
                type="text"
                inputMode="decimal"
                value={section.length}
                onChange={(e) => handleSectionChange(section.id, "length", e.target.value)}
                placeholder="e.g. 5.2"
              />
            </div>
            <span className="pb-2 text-muted-foreground font-medium">×</span>
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Width (m)</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={section.width}
                onChange={(e) => handleSectionChange(section.id, "width", e.target.value)}
                placeholder="e.g. 3.8"
              />
            </div>
            {data.sections.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveSection(section.id)}
                aria-label="Remove section"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add section button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddSection}
        className="gap-1.5 text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        Add section (L-shaped rooms, etc.)
      </Button>

      {/* Total */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-sm font-medium text-foreground">Estimated total area</span>
        <span className="text-lg font-bold text-primary">
          {data.totalSquareMeters > 0 ? `${data.totalSquareMeters.toFixed(1)} m²` : "— m²"}
        </span>
      </div>

      {/* Optional floor photo */}
      <div className="space-y-2">
        <Label className="text-sm">Floor photo (optional)</Label>
        <p className="text-xs text-muted-foreground">
          Upload a photo of the floor for the craftsman's visual reference — this helps them prepare an accurate quote.
        </p>

        {data.floorPhoto ? (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src={data.floorPhoto}
              alt="Floor photo"
              className="w-full h-40 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 gap-1"
              onClick={handleRemovePhoto}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 flex-1"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Disclaimer */}
      <Alert className="border-destructive/30 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-xs text-muted-foreground">
          <strong className="text-foreground">Measurement disclaimer:</strong> Please measure as
          accurately as possible. The craftsman may adjust pricing if the actual room dimensions
          differ significantly from your submission. When in doubt, round up slightly.
        </AlertDescription>
      </Alert>
    </div>
  );
}
