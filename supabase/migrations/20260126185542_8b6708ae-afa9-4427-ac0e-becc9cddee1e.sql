-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  hex_value TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster user lookups
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);

-- Enable Row Level Security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Helper function to check favorite ownership
CREATE OR REPLACE FUNCTION public.is_favorite_owner(fav_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.favorites
    WHERE id = fav_id AND user_id = auth.uid()
  )
$$;

-- RLS Policies for favorites table
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own favorites"
  ON public.favorites FOR UPDATE
  USING (public.is_favorite_owner(id));

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (public.is_favorite_owner(id));

-- Create storage bucket for favorite photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('favorite-photos', 'favorite-photos', false);

-- Storage policies for favorite photos
CREATE POLICY "Users can view their own favorite photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'favorite-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own favorite photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'favorite-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own favorite photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'favorite-photos' AND auth.uid()::text = (storage.foldername(name))[1]);