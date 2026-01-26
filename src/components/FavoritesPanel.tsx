import { cn } from "@/lib/utils";
import { Heart, Trash2, Image as ImageIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Favorite } from "@/hooks/useFavorites";

interface FavoritesPanelProps {
  favorites: Favorite[];
  loading: boolean;
  onSelectFavorite: (favorite: Favorite) => void;
  onRemoveFavorite: (id: string) => void;
  selectedHex?: string;
  disabled?: boolean;
}

export function FavoritesPanel({
  favorites,
  loading,
  onSelectFavorite,
  onRemoveFavorite,
  selectedHex,
  disabled,
}: FavoritesPanelProps) {
  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Loading favorites...
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="py-8 text-center">
        <Heart className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No favorites yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Click the heart icon on a color to save it
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg border transition-colors",
              "hover:bg-secondary/50 cursor-pointer",
              selectedHex === favorite.hex_value && "border-primary bg-primary/5",
              disabled && "opacity-50 pointer-events-none"
            )}
            onClick={() => !disabled && onSelectFavorite(favorite)}
          >
            <div
              className="w-10 h-10 rounded-lg border-2 border-border flex-shrink-0"
              style={{ backgroundColor: favorite.hex_value }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{favorite.color_name}</p>
              <p className="text-xs text-muted-foreground">{favorite.hex_value}</p>
            </div>
            {favorite.photo_url && (
              <ImageIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(favorite.id);
              }}
              className="p-1 hover:bg-destructive/10 rounded transition-colors"
              title="Remove from favorites"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
