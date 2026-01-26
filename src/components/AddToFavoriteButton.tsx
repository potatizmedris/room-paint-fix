import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AddToFavoriteButtonProps {
  colorName: string;
  colorHex: string;
  currentPhoto: string | null;
  isFavorite: boolean;
  onAdd: (withPhoto: boolean) => Promise<void>;
  disabled?: boolean;
}

export function AddToFavoriteButton({
  colorName,
  colorHex,
  currentPhoto,
  isFavorite,
  onAdd,
  disabled,
}: AddToFavoriteButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleClick = () => {
    if (isFavorite || disabled) return;
    
    if (currentPhoto) {
      setDialogOpen(true);
    } else {
      handleAdd(false);
    }
  };

  const handleAdd = async (withPhoto: boolean) => {
    setSaving(true);
    await onAdd(withPhoto);
    setSaving(false);
    setDialogOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isFavorite}
        className={cn(
          "p-2 rounded-full transition-all",
          isFavorite
            ? "bg-destructive/10 text-destructive cursor-default"
            : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        title={isFavorite ? "Already in favorites" : "Add to favorites"}
      >
        <Heart
          className={cn("w-5 h-5", isFavorite && "fill-current")}
        />
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Favorites</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-border"
                style={{ backgroundColor: colorHex }}
              />
              <div>
                <p className="font-medium">{colorName}</p>
                <p className="text-sm text-muted-foreground">{colorHex}</p>
              </div>
            </div>

            {currentPhoto && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <Checkbox
                  id="include-photo"
                  checked={includePhoto}
                  onCheckedChange={(checked) => setIncludePhoto(checked === true)}
                />
                <div className="flex-1">
                  <Label htmlFor="include-photo" className="cursor-pointer">
                    Save with current photo
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Link this color to the room photo you're editing
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleAdd(includePhoto)} disabled={saving}>
              {saving ? "Saving..." : "Add to Favorites"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
