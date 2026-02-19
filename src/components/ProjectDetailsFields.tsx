import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Palette, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { NCS_COLORS, NCS_CATEGORIES, type NCSColor } from "@/data/ncsColors";

export interface RoomColorEntry {
  id: string;
  colorCode: string;
  roomId: string; // "" means unassigned
}

export interface ProjectDetails {
  ceilingHeight: string;
  surfaces: string[];
  hasWallpaper: "yes" | "no" | "";
  wallpaperAction: "paint_over" | "remove" | "";
  wallCondition: "new" | "old" | "";
  desiredColorCode: string; // kept for backwards compat
  roomColors: RoomColorEntry[];
  paintSupply: "customer" | "painter" | "";
  furnitureHandling: "customer" | "painter" | "";
  preferredTime: "daytime" | "evening" | "";
  preferredDate: Date | undefined;
}

export const defaultProjectDetails: ProjectDetails = {
  ceilingHeight: "",
  surfaces: [],
  hasWallpaper: "",
  wallpaperAction: "",
  wallCondition: "",
  desiredColorCode: "",
  roomColors: [],
  paintSupply: "",
  furnitureHandling: "",
  preferredTime: "",
  preferredDate: undefined,
};

const generateColorId = () => `color-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

interface RoomOption {
  id: string;
  label: string;
}

interface ProjectDetailsFieldsProps {
  data: ProjectDetails;
  onChange: (data: ProjectDetails) => void;
  /** If true, the AI studio was used so color code field is hidden */
  hideColorCode?: boolean;
  /** Available rooms for color assignment */
  availableRooms?: RoomOption[];
}

/** Inline NCS color picker with search + manual input */
function NCSColorInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const matchedColor = NCS_COLORS.find(c => c.code === value);

  const filtered = useMemo(() => {
    if (!search) return NCS_COLORS;
    const q = search.toLowerCase();
    return NCS_COLORS.filter(c =>
      c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<string, NCSColor[]>();
    for (const c of filtered) {
      const arr = map.get(c.category) || [];
      arr.push(c);
      map.set(c.category, arr);
    }
    return map;
  }, [filtered]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-start text-left font-normal h-10 gap-2", !value && "text-muted-foreground")}
        >
          {matchedColor && (
            <span className="w-4 h-4 rounded-sm border border-border shrink-0" style={{ backgroundColor: matchedColor.hex }} />
          )}
          <span className="truncate">{value || placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-popover border border-border z-50" align="start">
        <div className="p-2 border-b border-border">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("details.searchOrType")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <ScrollArea className="h-60">
          <div className="p-1">
            {/* If user typed something not in the DB, offer to use it as-is */}
            {search && !NCS_COLORS.some(c => c.code.toLowerCase() === search.toLowerCase()) && (
              <button
                type="button"
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent text-left"
                onClick={() => { onChange(search.toUpperCase()); setOpen(false); setSearch(""); }}
              >
                <Palette className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{t("details.useCustomCode")} <strong>{search.toUpperCase()}</strong></span>
              </button>
            )}
            {Array.from(grouped.entries()).map(([category, colors]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground sticky top-0 bg-popover">{category}</div>
                {colors.map((color) => (
                  <button
                    key={color.code}
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent text-left",
                      value === color.code && "bg-accent"
                    )}
                    onClick={() => { onChange(color.code); setOpen(false); setSearch(""); }}
                  >
                    <span className="w-4 h-4 rounded-sm border border-border shrink-0" style={{ backgroundColor: color.hex }} />
                    <span className="truncate flex-1">{color.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{color.code}</span>
                    {value === color.code && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && !search && (
              <p className="text-xs text-muted-foreground text-center py-4">{t("details.noColorsFound")}</p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export function ProjectDetailsFields({ data, onChange, hideColorCode, availableRooms = [] }: ProjectDetailsFieldsProps) {
  const { t } = useLanguage();

  const update = (partial: Partial<ProjectDetails>) => {
    onChange({ ...data, ...partial });
  };

  const toggleSurface = (surface: string) => {
    const surfaces = data.surfaces.includes(surface)
      ? data.surfaces.filter(s => s !== surface)
      : [...data.surfaces, surface];
    update({ surfaces });
  };

  return (
    <div className="space-y-4">
      {/* Ceiling height */}
      <div className="space-y-2">
        <Label>{t("details.ceilingHeight")}</Label>
        <Input
          type="text"
          inputMode="decimal"
          value={data.ceilingHeight}
          onChange={(e) => update({ ceilingHeight: e.target.value.replace(/[^0-9.]/g, "") })}
          placeholder={t("details.ceilingHeightPlaceholder")}
        />
      </div>

      {/* Surfaces */}
      <div className="space-y-2">
        <Label>{t("details.surfaces")}</Label>
        <div className="flex gap-2">
          {(["walls", "ceiling"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSurface(s)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                data.surfaces.includes(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-foreground border-border hover:bg-muted/50"
              }`}
            >
              {t(`details.surface_${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Wallpaper */}
      <div className="space-y-2">
        <Label>{t("details.hasWallpaper")}</Label>
        <RadioGroup
          value={data.hasWallpaper}
          onValueChange={(v) => update({ hasWallpaper: v as "yes" | "no", wallpaperAction: v === "no" ? "" : data.wallpaperAction })}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="wp-yes" />
            <Label htmlFor="wp-yes" className="font-normal cursor-pointer">{t("details.yes")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="wp-no" />
            <Label htmlFor="wp-no" className="font-normal cursor-pointer">{t("details.no")}</Label>
          </div>
        </RadioGroup>
      </div>

      {data.hasWallpaper === "yes" && (
        <div className="space-y-2 ml-4 pl-3 border-l-2 border-primary/20">
          <Label>{t("details.wallpaperAction")}</Label>
          <RadioGroup
            value={data.wallpaperAction}
            onValueChange={(v) => update({ wallpaperAction: v as "paint_over" | "remove" })}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="paint_over" id="wp-paint" />
              <Label htmlFor="wp-paint" className="font-normal cursor-pointer">{t("details.paintOver")}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="remove" id="wp-remove" />
              <Label htmlFor="wp-remove" className="font-normal cursor-pointer">{t("details.removeWallpaper")}</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Wall condition */}
      <div className="space-y-2">
        <Label>{t("details.wallCondition")}</Label>
        <RadioGroup
          value={data.wallCondition}
          onValueChange={(v) => update({ wallCondition: v as "new" | "old" })}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="new" id="wc-new" />
            <Label htmlFor="wc-new" className="font-normal cursor-pointer">{t("details.conditionNew")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="old" id="wc-old" />
            <Label htmlFor="wc-old" className="font-normal cursor-pointer">{t("details.conditionOld")}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Paint supply — moved before color selection */}
      <div className="space-y-2">
        <Label>{t("details.paintSupply")}</Label>
        <RadioGroup
          value={data.paintSupply}
          onValueChange={(v) => update({ paintSupply: v as "customer" | "painter" })}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="customer" id="ps-cust" />
            <Label htmlFor="ps-cust" className="font-normal cursor-pointer">{t("details.customerSupplies")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="painter" id="ps-paint" />
            <Label htmlFor="ps-paint" className="font-normal cursor-pointer">{t("details.painterSupplies")}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Desired colors per room — only if AI studio not used AND painter supplies paint */}
      {!hideColorCode && data.paintSupply === "painter" && (
        <div className="space-y-3 ml-4 pl-3 border-l-2 border-primary/20">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              {t("details.desiredColor")}
            </Label>
          </div>

          {data.roomColors.length === 0 && (
            <p className="text-xs text-muted-foreground">{t("details.noColorsAdded")}</p>
          )}

          {data.roomColors.map((entry) => (
            <div key={entry.id} className="flex items-end gap-2 p-3 rounded-lg bg-muted/40 border border-border">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("details.colorCode")}</Label>
                <NCSColorInput
                  value={entry.colorCode}
                  onChange={(val) => {
                    const newColors = data.roomColors.map(c =>
                      c.id === entry.id ? { ...c, colorCode: val } : c
                    );
                    update({ roomColors: newColors });
                  }}
                  placeholder={t("details.desiredColorPlaceholder")}
                />
              </div>
              {availableRooms.length > 0 && (
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{t("details.assignToRoom")}</Label>
                  <Select
                    value={entry.roomId}
                    onValueChange={(v) => {
                      const newColors = data.roomColors.map(c =>
                        c.id === entry.id ? { ...c, roomId: v === "__none__" ? "" : v } : c
                      );
                      update({ roomColors: newColors });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("details.selectRoom")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">{t("details.allRooms")}</SelectItem>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>{room.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  const newColors = data.roomColors.filter(c => c.id !== entry.id);
                  update({ roomColors: newColors });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              const newEntry: RoomColorEntry = { id: generateColorId(), colorCode: "", roomId: "" };
              update({ roomColors: [...data.roomColors, newEntry] });
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            {t("details.addColor")}
          </Button>
        </div>
      )}

      {/* Furniture handling */}
      <div className="space-y-2">
        <Label>{t("details.furnitureHandling")}</Label>
        <RadioGroup
          value={data.furnitureHandling}
          onValueChange={(v) => update({ furnitureHandling: v as "customer" | "painter" })}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="customer" id="fh-cust" />
            <Label htmlFor="fh-cust" className="font-normal cursor-pointer">{t("details.customerHandles")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="painter" id="fh-paint" />
            <Label htmlFor="fh-paint" className="font-normal cursor-pointer">{t("details.painterHandles")}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Preferred time */}
      <div className="space-y-2">
        <Label>{t("details.preferredTime")}</Label>
        <RadioGroup
          value={data.preferredTime}
          onValueChange={(v) => update({ preferredTime: v as "daytime" | "evening" })}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="daytime" id="pt-day" />
            <Label htmlFor="pt-day" className="font-normal cursor-pointer">{t("details.daytime")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="evening" id="pt-eve" />
            <Label htmlFor="pt-eve" className="font-normal cursor-pointer">{t("details.evening")}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Preferred date */}
      <div className="space-y-2">
        <Label>{t("details.preferredDate")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "w-full justify-start text-left font-normal",
                !data.preferredDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.preferredDate ? format(data.preferredDate, "PPP") : t("details.pickDate")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.preferredDate}
              onSelect={(date) => update({ preferredDate: date })}
              disabled={(date) => date < new Date()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground italic">{t("details.dateDisclaimer")}</p>
      </div>
    </div>
  );
}
