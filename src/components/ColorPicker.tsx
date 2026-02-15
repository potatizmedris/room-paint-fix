import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NCSColorPicker } from "@/components/NCSColorPicker";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { AddToFavoriteButton } from "@/components/AddToFavoriteButton";
import { NCS_COLORS, type NCSCategory } from "@/data/ncsColors";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Favorite } from "@/hooks/useFavorites";

interface ColorOption {
  name: string;
  hex: string;
}

interface PresetColor extends ColorOption {
  category: NCSCategory;
}

const PRESET_COLORS: PresetColor[] = [
  { name: "Cloud White", hex: "#F5F5F0", category: "Whites & Neutrals" },
  { name: "Soft Cream", hex: "#F5E6D3", category: "Whites & Neutrals" },
  { name: "Sage Green", hex: "#9CAF88", category: "Greens" },
  { name: "Ocean Blue", hex: "#5B8BA0", category: "Blues" },
  { name: "Dusty Rose", hex: "#D4A5A5", category: "Pinks" },
  { name: "Warm Gray", hex: "#A8A29E", category: "Grays" },
  { name: "Terracotta", hex: "#CD7F5C", category: "Oranges" },
  { name: "Navy Blue", hex: "#2C3E50", category: "Blues" },
  { name: "Soft Lavender", hex: "#B8A9C9", category: "Purples" },
  { name: "Butter Yellow", hex: "#F4E5B8", category: "Yellows" },
  { name: "Forest Green", hex: "#4A6741", category: "Greens" },
  { name: "Charcoal", hex: "#36454F", category: "Grays" },
];

function ncsToHex(ncsCode: string): string | null {
  const match = ncsCode.toUpperCase().match(/^S?\s*(\d{2})(\d{2})-?([YRBN])(\d{2})?([YRBN])?$/);
  if (!match) return null;
  const blackness = parseInt(match[1]) / 100;
  const chromaticness = parseInt(match[2]) / 100;
  const hue1 = match[3];
  const hueValue = match[4] ? parseInt(match[4]) : 0;
  const hue2 = match[5] || '';
  let r = 0, g = 0, b = 0;
  const hueString = `${hue1}${hueValue}${hue2}`;
  if (hueString.startsWith('Y') && hueString.includes('R')) { const ratio = hueValue / 100; r = 255; g = Math.round(255 * (1 - ratio * 0.6)); b = 0; }
  else if (hueString.startsWith('R') && hueString.includes('Y')) { const ratio = hueValue / 100; r = 255; g = Math.round(255 * ratio * 0.6); b = 0; }
  else if (hueString.startsWith('R') && hueString.includes('B')) { const ratio = hueValue / 100; r = 255; g = 0; b = Math.round(255 * ratio); }
  else if (hueString.startsWith('B') && hueString.includes('R')) { const ratio = hueValue / 100; r = Math.round(255 * ratio); g = 0; b = 255; }
  else if (hueString.startsWith('B') && hueString.includes('G')) { const ratio = hueValue / 100; r = 0; g = Math.round(255 * ratio); b = 255; }
  else if (hueString.startsWith('G') && hueString.includes('B')) { const ratio = hueValue / 100; r = 0; g = 255; b = Math.round(255 * ratio); }
  else if (hueString.startsWith('G') && hueString.includes('Y')) { const ratio = hueValue / 100; r = Math.round(255 * ratio); g = 255; b = 0; }
  else if (hueString.startsWith('Y') && hueString.includes('G')) { r = 255; g = 255; b = 0; }
  else if (hueString === 'Y') { r = 255; g = 255; b = 0; }
  else if (hueString === 'R') { r = 255; g = 0; b = 0; }
  else if (hueString === 'B') { r = 0; g = 0; b = 255; }
  else if (hueString === 'G') { r = 0; g = 255; b = 0; }
  else if (hueString === 'N') { r = 128; g = 128; b = 128; }
  const gray = 128;
  r = Math.round(gray + (r - gray) * chromaticness);
  g = Math.round(gray + (g - gray) * chromaticness);
  b = Math.round(gray + (b - gray) * chromaticness);
  r = Math.round(r * (1 - blackness));
  g = Math.round(g * (1 - blackness));
  b = Math.round(b * (1 - blackness));
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

interface ColorPickerProps {
  selectedColor: ColorOption | null;
  onColorSelect: (color: ColorOption) => void;
  disabled?: boolean;
  favorites: Favorite[];
  favoritesLoading: boolean;
  onAddFavorite: (colorName: string, hexValue: string, photoBase64?: string) => Promise<unknown>;
  onRemoveFavorite: (id: string) => Promise<boolean>;
  isFavorite: (hexValue: string) => boolean;
  currentPhoto: string | null;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

export function ColorPicker({
  selectedColor, onColorSelect, disabled,
  favorites, favoritesLoading, onAddFavorite, onRemoveFavorite, isFavorite,
  currentPhoto, isAuthenticated, onAuthRequired,
}: ColorPickerProps) {
  const { t } = useLanguage();
  const [ncsCode, setNcsCode] = useState("");
  const [ncsError, setNcsError] = useState<string | null>(null);
  const [expandedPreset, setExpandedPreset] = useState<string | null>(null);

  const getIntensityColors = (category: NCSCategory) => NCS_COLORS.filter((c) => c.category === category).slice(0, 8);

  const handlePresetClick = (color: PresetColor) => { if (disabled) return; onColorSelect(color); };

  const toggleExpand = (e: React.MouseEvent, colorName: string) => {
    e.stopPropagation();
    if (disabled) return;
    setExpandedPreset((prev) => (prev === colorName ? null : colorName));
  };

  const handleIntensitySelect = (ncsColor: { code: string; hex: string }) => {
    if (disabled) return;
    onColorSelect({ name: `NCS ${ncsColor.code}`, hex: ncsColor.hex });
    setExpandedPreset(null);
  };

  const handleApplyNcs = () => {
    if (!ncsCode.trim()) { setNcsError(t("color.enterNcs")); return; }
    const hex = ncsToHex(ncsCode);
    if (hex) { setNcsError(null); onColorSelect({ name: `NCS ${ncsCode.toUpperCase()}`, hex }); }
    else { setNcsError(t("color.invalidNcs")); }
  };

  const handleAddToFavorite = async (withPhoto: boolean) => {
    if (!isAuthenticated) { onAuthRequired(); return; }
    if (!selectedColor) return;
    await onAddFavorite(selectedColor.name, selectedColor.hex, withPhoto ? currentPhoto || undefined : undefined);
  };

  const handleFavoriteSelect = (favorite: Favorite) => {
    onColorSelect({ name: favorite.color_name, hex: favorite.hex_value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-medium text-foreground">{t("color.chooseWallColor")}</h3>
      
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="presets" className="text-[11px] sm:text-sm px-1 sm:px-3">{t("color.quick")}</TabsTrigger>
          <TabsTrigger value="ncs" className="text-[11px] sm:text-sm px-1 sm:px-3">{t("color.ncs")}</TabsTrigger>
          <TabsTrigger value="favorites" className="text-[11px] sm:text-sm px-1 sm:px-3">{t("color.favorites")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presets" className="space-y-4 mt-4">
          <div className="grid grid-cols-6 gap-3">
            {PRESET_COLORS.map((color) => (
              <div key={color.hex} className="relative group">
                <button
                  onClick={() => handlePresetClick(color)}
                  disabled={disabled}
                  className={cn("color-swatch w-full", selectedColor?.hex === color.hex && "color-swatch-active", disabled && "opacity-50 cursor-not-allowed hover:scale-100")}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <button
                  onClick={(e) => toggleExpand(e, color.name)}
                  disabled={disabled}
                  className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-border",
                    "flex items-center justify-center shadow-sm hover:bg-secondary transition-colors",
                    expandedPreset === color.name && "bg-primary border-primary",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  title={t("color.showIntensities")}
                >
                  <ChevronDown className={cn("h-3 w-3 transition-transform", expandedPreset === color.name ? "rotate-180 text-primary-foreground" : "text-muted-foreground")} />
                </button>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-popover border border-border rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-sm">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
          
          {expandedPreset && (
            <div className="p-3 rounded-lg border border-border bg-secondary/30 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-xs text-muted-foreground mb-2">
                {expandedPreset} {t("color.intensities")} ({PRESET_COLORS.find(c => c.name === expandedPreset)?.category})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {getIntensityColors(PRESET_COLORS.find(c => c.name === expandedPreset)?.category as NCSCategory).map((ncsColor) => (
                  <button
                    key={ncsColor.code}
                    onClick={() => handleIntensitySelect(ncsColor)}
                    disabled={disabled}
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-md",
                      selectedColor?.hex === ncsColor.hex ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-border",
                      disabled && "opacity-50 cursor-not-allowed hover:scale-100"
                    )}
                    style={{ backgroundColor: ncsColor.hex }}
                    title={`${ncsColor.name} (${ncsColor.code})`}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2 pt-4 border-t border-border">
            <label className="text-sm text-muted-foreground">{t("color.customNcs")}</label>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={ncsCode}
                onChange={(e) => { setNcsCode(e.target.value); setNcsError(null); }}
                placeholder="e.g., S 1050-Y90R"
                disabled={disabled}
                className="flex-1"
              />
              <button onClick={handleApplyNcs} disabled={disabled} className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                {t("color.apply")}
              </button>
            </div>
            {ncsError && <p className="text-xs text-destructive">{ncsError}</p>}
          </div>
        </TabsContent>
        
        <TabsContent value="ncs" className="mt-4">
          <NCSColorPicker onColorSelect={onColorSelect} disabled={disabled} selectedHex={selectedColor?.hex} />
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          {!isAuthenticated ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">{t("color.signInFavorites")}</p>
              <button onClick={onAuthRequired} className="text-sm text-primary hover:text-primary/80 font-medium">{t("color.signIn")}</button>
            </div>
          ) : (
            <FavoritesPanel favorites={favorites} loading={favoritesLoading} onSelectFavorite={handleFavoriteSelect} onRemoveFavorite={onRemoveFavorite} selectedHex={selectedColor?.hex} disabled={disabled} />
          )}
        </TabsContent>
      </Tabs>

      {selectedColor && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: selectedColor.hex }} />
          <span className="text-sm font-medium text-foreground flex-1">{selectedColor.name}</span>
          <span className="text-xs text-muted-foreground">{selectedColor.hex}</span>
          <AddToFavoriteButton
            colorName={selectedColor.name}
            colorHex={selectedColor.hex}
            currentPhoto={currentPhoto}
            isFavorite={isFavorite(selectedColor.hex)}
            onAdd={handleAddToFavorite}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

export type { ColorOption };
