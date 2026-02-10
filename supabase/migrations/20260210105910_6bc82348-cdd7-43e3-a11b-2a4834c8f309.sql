
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  address TEXT DEFAULT '',
  phone_number TEXT DEFAULT '',
  gender TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid());
