import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface ProcessedRoom {
  id: string;
  originalImage: string;
  processedImage: string | null;
  colorName: string;
  colorHex: string;
}

interface RoomGalleryProps {
  rooms: ProcessedRoom[];
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onRemoveRoom: (roomId: string) => void;
  onAddRoom: () => void;
  disabled?: boolean;
}

export function RoomGallery({
  rooms,
  currentRoomId,
  onSelectRoom,
  onRemoveRoom,
  onAddRoom,
  disabled,
}: RoomGalleryProps) {
  if (rooms.length === 0) return null;

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-foreground">Your Rooms ({rooms.length})</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddRoom}
          disabled={disabled}
          className="gap-1 h-7 text-xs"
        >
          <Plus className="w-3 h-3" />
          Add Room
        </Button>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={cn(
                "relative flex-shrink-0 group cursor-pointer",
                "rounded-lg overflow-hidden border-2 transition-all",
                currentRoomId === room.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-border"
              )}
              onClick={() => onSelectRoom(room.id)}
            >
              <img
                src={room.processedImage || room.originalImage}
                alt={`Room with ${room.colorName}`}
                className="w-20 h-14 object-cover"
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: room.colorHex }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRoom(room.id);
                }}
                disabled={disabled}
                className={cn(
                  "absolute top-0.5 right-0.5 w-5 h-5 rounded-full",
                  "bg-destructive/80 hover:bg-destructive text-destructive-foreground",
                  "flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                  disabled && "cursor-not-allowed"
                )}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
