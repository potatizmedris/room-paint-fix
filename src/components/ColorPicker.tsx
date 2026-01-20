import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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

// Approximate NCS to hex conversion
function ncsToHex(ncsCode: string): string | null {
  // Parse NCS code format: S XXYY-ZZZZ (e.g., "S 1050-Y90R")
  const match = ncsCode.toUpperCase().match(/^S?\s*(\d{2})(\d{2})-?([YRBN])(\d{2})?([YRBN])?$/);
  
  if (!match) return null;
  
  const blackness = parseInt(match[1]) / 100;
  const chromaticness = parseInt(match[2]) / 100;
  const hue1 = match[3];
  const hueValue = match[4] ? parseInt(match[4]) : 0;
  const hue2 = match[5] || '';
  
  // Map NCS hue to RGB base colors
  let r = 0, g = 0, b = 0;
  
  const hueString = `${hue1}${hueValue}${hue2}`;
  
  // Simplified hue mapping
  if (hueString.startsWith('Y') && hueString.includes('R')) {
    // Yellow-Red (orange range)
    const ratio = hueValue / 100;
    r = 255;
    g = Math.round(255 * (1 - ratio * 0.6));
    b = 0;
  } else if (hueString.startsWith('R') && hueString.includes('Y')) {
    // Red-Yellow
    const ratio = hueValue / 100;
    r = 255;
    g = Math.round(255 * ratio * 0.6);
    b = 0;
  } else if (hueString.startsWith('R') && hueString.includes('B')) {
    // Red-Blue (magenta range)
    const ratio = hueValue / 100;
    r = 255;
    g = 0;
    b = Math.round(255 * ratio);
  } else if (hueString.startsWith('B') && hueString.includes('R')) {
    // Blue-Red
    const ratio = hueValue / 100;
    r = Math.round(255 * ratio);
    g = 0;
    b = 255;
  } else if (hueString.startsWith('B') && hueString.includes('G')) {
    // Blue-Green (cyan range)
    const ratio = hueValue / 100;
    r = 0;
    g = Math.round(255 * ratio);
    b = 255;
  } else if (hueString.startsWith('G') && hueString.includes('B')) {
    // Green-Blue
    const ratio = hueValue / 100;
    r = 0;
    g = 255;
    b = Math.round(255 * ratio);
  } else if (hueString.startsWith('G') && hueString.includes('Y')) {
    // Green-Yellow
    const ratio = hueValue / 100;
    r = Math.round(255 * ratio);
    g = 255;
    b = 0;
  } else if (hueString.startsWith('Y') && hueString.includes('G')) {
    // Yellow-Green
    const ratio = hueValue / 100;
    r = 255;
    g = 255;
    b = 0;
  } else if (hueString === 'Y') {
    r = 255; g = 255; b = 0;
  } else if (hueString === 'R') {
    r = 255; g = 0; b = 0;
  } else if (hueString === 'B') {
    r = 0; g = 0; b = 255;
  } else if (hueString === 'G') {
    r = 0; g = 255; b = 0;
  } else if (hueString === 'N') {
    // Neutral (gray)
    r = 128; g = 128; b = 128;
  }
  
  // Apply chromaticness (saturation)
  const gray = 128;
  r = Math.round(gray + (r - gray) * chromaticness);
  g = Math.round(gray + (g - gray) * chromaticness);
  b = Math.round(gray + (b - gray) * chromaticness);
  
  // Apply blackness
  r = Math.round(r * (1 - blackness));
  g = Math.round(g * (1 - blackness));
  b = Math.round(b * (1 - blackness));
  
  // Clamp values
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

interface ColorPickerProps {
  selectedColor: ColorOption | null;
  onColorSelect: (color: ColorOption) => void;
  disabled?: boolean;
}

export function ColorPicker({ selectedColor, onColorSelect, disabled }: ColorPickerProps) {
  const [ncsCode, setNcsCode] = useState("");
  const [ncsError, setNcsError] = useState<string | null>(null);

  const handleApplyNcs = () => {
    if (!ncsCode.trim()) {
      setNcsError("Please enter an NCS code");
      return;
    }
    
    const hex = ncsToHex(ncsCode);
    if (hex) {
      setNcsError(null);
      onColorSelect({ name: `NCS ${ncsCode.toUpperCase()}`, hex });
    } else {
      setNcsError("Invalid NCS code format (e.g., S 1050-Y90R)");
    }
  };

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

      <div className="space-y-2 pt-4 border-t border-border">
        <label className="text-sm text-muted-foreground">NCS Code:</label>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            value={ncsCode}
            onChange={(e) => {
              setNcsCode(e.target.value);
              setNcsError(null);
            }}
            placeholder="e.g., S 1050-Y90R"
            disabled={disabled}
            className="flex-1"
          />
          <button
            onClick={handleApplyNcs}
            disabled={disabled}
            className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Apply NCS
          </button>
        </div>
        {ncsError && (
          <p className="text-xs text-destructive">{ncsError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Format: S XXYY-HUE (e.g., S 1050-Y90R, S 2030-B)
        </p>
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