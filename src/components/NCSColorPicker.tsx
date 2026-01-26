import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { NCS_COLORS, NCS_CATEGORIES, type NCSColor, type NCSCategory } from "@/data/ncsColors";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NCSColorPickerProps {
  onColorSelect: (color: { name: string; hex: string }) => void;
  disabled?: boolean;
  selectedHex?: string;
}

export function NCSColorPicker({ onColorSelect, disabled, selectedHex }: NCSColorPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<NCSCategory | null>(null);

  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) return NCS_COLORS;
    
    const query = searchQuery.toLowerCase();
    return NCS_COLORS.filter(
      (color) =>
        color.code.toLowerCase().includes(query) ||
        color.name.toLowerCase().includes(query) ||
        color.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const colorsByCategory = useMemo(() => {
    const grouped: Record<NCSCategory, NCSColor[]> = {} as Record<NCSCategory, NCSColor[]>;
    NCS_CATEGORIES.forEach((cat) => {
      grouped[cat] = filteredColors.filter((c) => c.category === cat);
    });
    return grouped;
  }, [filteredColors]);

  const handleColorClick = (color: NCSColor) => {
    if (disabled) return;
    onColorSelect({ name: `NCS ${color.code}`, hex: color.hex });
  };

  const toggleCategory = (category: NCSCategory) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search NCS code or color name..."
          disabled={disabled}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[280px] rounded-md border border-border">
        <div className="p-2 space-y-1">
          {NCS_CATEGORIES.map((category) => {
            const colors = colorsByCategory[category];
            if (colors.length === 0) return null;
            
            const isExpanded = expandedCategory === category;
            
            return (
              <div key={category} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  disabled={disabled}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium",
                    "bg-secondary/50 hover:bg-secondary/80 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>{category}</span>
                    <span className="text-xs text-muted-foreground">({colors.length})</span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="p-2 bg-background grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.code}
                        onClick={() => handleColorClick(color)}
                        disabled={disabled}
                        className={cn(
                          "group relative aspect-square rounded-lg border-2 transition-all",
                          "hover:scale-110 hover:z-10 hover:shadow-md",
                          selectedHex === color.hex
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-border",
                          disabled && "opacity-50 cursor-not-allowed hover:scale-100"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.code})`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded shadow-lg z-20 whitespace-nowrap pointer-events-none">
                            <p className="text-xs font-medium text-foreground">{color.name}</p>
                            <p className="text-xs text-muted-foreground">{color.code}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredColors.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No colors found matching "{searchQuery}"
            </div>
          )}
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        {NCS_COLORS.length} NCS colors available • Click a category to expand
      </p>
    </div>
  );
}
