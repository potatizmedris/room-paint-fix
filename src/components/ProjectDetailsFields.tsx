import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export interface ProjectDetails {
  ceilingHeight: string;
  surfaces: string[];
  hasWallpaper: "yes" | "no" | "";
  wallpaperAction: "paint_over" | "remove" | "";
  wallCondition: "new" | "old" | "";
  desiredColorCode: string;
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
  paintSupply: "",
  furnitureHandling: "",
  preferredTime: "",
  preferredDate: undefined,
};

interface ProjectDetailsFieldsProps {
  data: ProjectDetails;
  onChange: (data: ProjectDetails) => void;
  /** If true, the AI studio was used so color code field is hidden */
  hideColorCode?: boolean;
}

export function ProjectDetailsFields({ data, onChange, hideColorCode }: ProjectDetailsFieldsProps) {
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

      {/* Desired color code (only if AI studio not used) */}
      {!hideColorCode && (
        <div className="space-y-2">
          <Label>{t("details.desiredColor")}</Label>
          <Input
            value={data.desiredColorCode}
            onChange={(e) => update({ desiredColorCode: e.target.value })}
            placeholder={t("details.desiredColorPlaceholder")}
          />
        </div>
      )}

      {/* Paint supply */}
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
