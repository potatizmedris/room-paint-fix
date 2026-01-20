import { useState } from "react";
import { cn } from "@/lib/utils";

interface ColorOption {
  name: string;
  hex: string;
}

const PRESET_COLORS: ColorOption[] = [
  { name: "Cloud White", hex: "#F5F5F0" },
  { name: "Soft Cream", hex: "#F5E6D3" },
  { name: "Sage Green", hex: "#9CAF88" },
  { name: "Ocean Blue", hex: "#5B8BA0" },
  { name: "Dusty Rose", hex: "#D4A5A5" },
  { name: "Warm Gray", hex: "#A8A29E" },
  { name: "Terracotta", hex: "#CD7F5C" },
  { name: "Navy Blue", hex: "#2C3E50" },
  { name: "Soft Lavender", hex: "#B8A9C9" },
  { name: "Butter Yellow", hex: "#F4E5B8" },
  { name: "Forest Green", hex: "#4A6741" },
  { name: "Charcoal", hex: "#36454F" },
];

interface ColorPickerProps {
  selectedColor: ColorOption | null;
  onColorSelect: (color: ColorOption) => void;
  disabled?: boolean;
}

export function ColorPicker({ selectedColor, onColorSelect, disabled }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState("#ffffff");

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-medium text-foreground">Choose Wall Color</h3>
      
      <div className="grid grid-cols-6 gap-3">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.hex}
            onClick={() => !disabled && onColorSelect(color)}
            disabled={disabled}
            className={cn(
              "color-swatch group relative",
              selectedColor?.hex === color.hex && "color-swatch-active",
              disabled && "opacity-50 cursor-not-allowed hover:scale-100"
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {color.name}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <label className="text-sm text-muted-foreground">Custom:</label>
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          disabled={disabled}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={() => !disabled && onColorSelect({ name: "Custom Color", hex: customColor })}
          disabled={disabled}
          className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Custom
        </button>
      </div>

      {selectedColor && (
        <div className="flex items-center gap-2 pt-2">
          <div 
            className="w-6 h-6 rounded-full border border-border"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="text-sm font-medium text-foreground">{selectedColor.name}</span>
          <span className="text-xs text-muted-foreground">{selectedColor.hex}</span>
        </div>
      )}
    </div>
  );
}

export type { ColorOption };