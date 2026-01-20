import { useRef, useCallback } from "react";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelect, disabled }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-border rounded-2xl p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium">Drop your wall photo here</p>
            <p className="text-sm text-muted-foreground mt-1">or use the buttons below</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
          className="btn-upload flex-1 flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="btn-upload flex-1 flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Image
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}