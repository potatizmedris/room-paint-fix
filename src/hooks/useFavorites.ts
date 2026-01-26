import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Favorite {
  id: string;
  color_name: string;
  hex_value: string;
  photo_url: string | null;
  created_at: string;
}

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } else {
      setFavorites(data || []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (
    colorName: string,
    hexValue: string,
    photoBase64?: string
  ) => {
    if (!userId) {
      toast.error("Please sign in to save favorites");
      return null;
    }

    let photoUrl: string | null = null;

    // Upload photo if provided
    if (photoBase64) {
      const base64Data = photoBase64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const fileName = `${userId}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("favorite-photos")
        .upload(fileName, blob);

      if (uploadError) {
        console.error("Error uploading photo:", uploadError);
        toast.error("Failed to upload photo");
      } else {
        const { data: urlData } = supabase.storage
          .from("favorite-photos")
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: userId,
        color_name: colorName,
        hex_value: hexValue,
        photo_url: photoUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding favorite:", error);
      toast.error("Failed to save favorite");
      return null;
    }

    setFavorites((prev) => [data, ...prev]);
    toast.success("Color added to favorites!");
    return data;
  };

  const removeFavorite = async (id: string) => {
    const favorite = favorites.find((f) => f.id === id);
    
    // Delete photo from storage if exists
    if (favorite?.photo_url && userId) {
      const fileName = favorite.photo_url.split("/").slice(-2).join("/");
      await supabase.storage.from("favorite-photos").remove([fileName]);
    }

    const { error } = await supabase.from("favorites").delete().eq("id", id);

    if (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite");
      return false;
    }

    setFavorites((prev) => prev.filter((f) => f.id !== id));
    toast.success("Favorite removed");
    return true;
  };

  const isFavorite = (hexValue: string) => {
    return favorites.some((f) => f.hex_value === hexValue);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}
