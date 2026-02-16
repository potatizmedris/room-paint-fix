import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Camera, Upload, AlertTriangle, Ruler, ChevronDown, ChevronUp, ImageIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export interface RoomSection {
  id: string;
  label: string;
  length: string;
  width: string;
}

export interface MeasurementRoom {
  id: string;
  label: string;
  photo: string | null;
  sections: RoomSection[];
  totalSquareMeters: number;
}

export interface MultiRoomMeasurementData {
  rooms: MeasurementRoom[];
  grandTotalSquareMeters: number;
}

interface MultiRoomMeasurementProps {
  data: MultiRoomMeasurementData;
  onChange: (data: MultiRoomMeasurementData) => void;
  /** If true, rooms come pre-populated (studio path) and user can't add/remove rooms */
  readOnlyRooms?: boolean;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

function calculateSectionTotal(sections: RoomSection[]): number {
  return sections.reduce((total, s) => {
    const l = parseFloat(s.length) || 0;
    const w = parseFloat(s.width) || 0;
    return total + l * w;
  }, 0);
}

function calculateGrandTotal(rooms: MeasurementRoom[]): number {
  return rooms.reduce((t, r) => t + r.totalSquareMeters, 0);
}

export function MultiRoomMeasurement({ data, onChange, readOnlyRooms }: MultiRoomMeasurementProps) {
  const { t } = useLanguage();
  const [expandedRoom, setExpandedRoom] = useState<string | null>(data.rooms[0]?.id || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [photoTargetRoomId, setPhotoTargetRoomId] = useState<string | null>(null);

  const updateRooms = useCallback((newRooms: MeasurementRoom[]) => {
    onChange({ rooms: newRooms, grandTotalSquareMeters: calculateGrandTotal(newRooms) });
  }, [onChange]);

  const handleAddRoom = () => {
    const num = data.rooms.length + 1;
    const newRoom: MeasurementRoom = {
      id: generateId(),
      label: `${t("measurement.room")} ${num}`,
      photo: null,
      sections: [{ id: generateId(), label: `${t("measurement.section")} 1`, length: "", width: "" }],
      totalSquareMeters: 0,
    };
    const newRooms = [...data.rooms, newRoom];
    updateRooms(newRooms);
    setExpandedRoom(newRoom.id);
  };

  const handleRemoveRoom = (roomId: string) => {
    if (data.rooms.length <= 1) return;
    const newRooms = data.rooms.filter(r => r.id !== roomId);
    updateRooms(newRooms);
    if (expandedRoom === roomId) {
      setExpandedRoom(newRooms[0]?.id || null);
    }
  };

  const handleSectionChange = (roomId: string, sectionId: string, field: "length" | "width", value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, "");
    const newRooms = data.rooms.map(room => {
      if (room.id !== roomId) return room;
      const newSections = room.sections.map(s => s.id === sectionId ? { ...s, [field]: sanitized } : s);
      return { ...room, sections: newSections, totalSquareMeters: calculateSectionTotal(newSections) };
    });
    updateRooms(newRooms);
  };

  const handleAddSection = (roomId: string) => {
    const newRooms = data.rooms.map(room => {
      if (room.id !== roomId) return room;
      const num = room.sections.length + 1;
      const newSections = [...room.sections, { id: generateId(), label: `${t("measurement.section")} ${num}`, length: "", width: "" }];
      return { ...room, sections: newSections };
    });
    updateRooms(newRooms);
  };

  const handleRemoveSection = (roomId: string, sectionId: string) => {
    const newRooms = data.rooms.map(room => {
      if (room.id !== roomId) return room;
      if (room.sections.length <= 1) return room;
      const newSections = room.sections.filter(s => s.id !== sectionId);
      return { ...room, sections: newSections, totalSquareMeters: calculateSectionTotal(newSections) };
    });
    updateRooms(newRooms);
  };

  const handlePhotoUploadClick = (roomId: string, type: "file" | "camera") => {
    setPhotoTargetRoomId(roomId);
    if (type === "camera") cameraInputRef.current?.click();
    else fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || !photoTargetRoomId) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newRooms = data.rooms.map(room =>
        room.id === photoTargetRoomId ? { ...room, photo: ev.target?.result as string } : room
      );
      updateRooms(newRooms);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = (roomId: string) => {
    const newRooms = data.rooms.map(room =>
      room.id === roomId ? { ...room, photo: null } : room
    );
    updateRooms(newRooms);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Ruler className="w-4 h-4 text-primary" />
        <Label className="text-base font-semibold">{t("measurement.title")}</Label>
      </div>

      <div className="space-y-3">
        {data.rooms.map((room, roomIndex) => {
          const isExpanded = expandedRoom === room.id;
          return (
            <div key={room.id} className="rounded-lg border border-border overflow-hidden">
              {/* Room header */}
              <button
                type="button"
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left transition-colors",
                  isExpanded ? "bg-primary/5" : "bg-muted/30 hover:bg-muted/50"
                )}
                onClick={() => setExpandedRoom(isExpanded ? null : room.id)}
              >
                {room.photo && (
                  <img src={room.photo} alt={room.label} className="w-10 h-10 rounded-md object-cover border border-border flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {t("measurement.room")} {roomIndex + 1}
                  </span>
                  {room.totalSquareMeters > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({room.totalSquareMeters.toFixed(1)} m²)
                    </span>
                  )}
                </div>
                {!readOnlyRooms && data.rooms.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 w-7 h-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleRemoveRoom(room.id); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>

              {/* Room content */}
              {isExpanded && (
                <div className="p-3 space-y-3 border-t border-border">
                  {/* Photo section */}
                  {!room.photo && !readOnlyRooms && (
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="gap-1.5 flex-1 text-xs" onClick={() => handlePhotoUploadClick(room.id, "camera")}>
                        <Camera className="w-3.5 h-3.5" />
                        {t("measurement.takePhoto")}
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="gap-1.5 flex-1 text-xs" onClick={() => handlePhotoUploadClick(room.id, "file")}>
                        <Upload className="w-3.5 h-3.5" />
                        {t("measurement.uploadPhoto")}
                      </Button>
                    </div>
                  )}
                  {room.photo && (
                    <div className="relative rounded-lg overflow-hidden border border-border group">
                      <img src={room.photo} alt={room.label} className="w-full h-32 object-cover" />
                      {!readOnlyRooms && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePhoto(room.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Measurement sections */}
                  {room.sections.map((section, sIndex) => (
                    <div key={section.id} className="flex items-end gap-2 p-3 rounded-lg bg-muted/40 border border-border">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          {room.sections.length > 1 ? `${t("measurement.section")} ${sIndex + 1} — ${t("measurement.length")}` : t("measurement.length")}
                        </Label>
                        <Input type="text" inputMode="decimal" value={section.length} onChange={(e) => handleSectionChange(room.id, section.id, "length", e.target.value)} placeholder="e.g. 5.2" />
                      </div>
                      <span className="pb-2 text-muted-foreground font-medium">×</span>
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{t("measurement.width")}</Label>
                        <Input type="text" inputMode="decimal" value={section.width} onChange={(e) => handleSectionChange(room.id, section.id, "width", e.target.value)} placeholder="e.g. 3.8" />
                      </div>
                      {room.sections.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveSection(room.id, section.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddSection(room.id)} className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    {t("measurement.addSection")}
                  </Button>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="text-xs font-medium text-foreground">{t("measurement.room")} {roomIndex + 1}</span>
                    <span className="text-sm font-bold text-primary">
                      {room.totalSquareMeters > 0 ? `${room.totalSquareMeters.toFixed(1)} m²` : "— m²"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!readOnlyRooms && (
        <Button type="button" variant="outline" size="sm" onClick={handleAddRoom} className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          {t("measurement.addRoom")}
        </Button>
      )}

      {/* Grand total */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-sm font-medium text-foreground">{t("measurement.estimatedTotal")}</span>
        <span className="text-lg font-bold text-primary">
          {data.grandTotalSquareMeters > 0 ? `${data.grandTotalSquareMeters.toFixed(1)} m²` : "— m²"}
        </span>
      </div>

      <Alert className="border-destructive/30 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-xs text-muted-foreground">
          <strong className="text-foreground">{t("measurement.disclaimer")}</strong> {t("measurement.disclaimerText")}
        </AlertDescription>
      </Alert>

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
    </div>
  );
}
