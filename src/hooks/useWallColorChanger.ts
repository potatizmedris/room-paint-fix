import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ColorOption } from "@/components/ColorPicker";

export function useWallColorChanger() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const changeWallColor = async (imageBase64: string, color: ColorOption) => {
    setIsProcessing(true);
    setProcessedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('change-wall-color', {
        body: {
          imageBase64,
          targetColor: color.hex,
          colorName: color.name,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.imageUrl) {
        setProcessedImage(data.imageUrl);
        toast.success("Wall color changed successfully!");
      } else {
        throw new Error("No image was returned");
      }
    } catch (error) {
      console.error("Error changing wall color:", error);
      const message = error instanceof Error ? error.message : "Failed to change wall color";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearProcessedImage = () => {
    setProcessedImage(null);
  };

  return {
    isProcessing,
    processedImage,
    changeWallColor,
    clearProcessedImage,
  };
}