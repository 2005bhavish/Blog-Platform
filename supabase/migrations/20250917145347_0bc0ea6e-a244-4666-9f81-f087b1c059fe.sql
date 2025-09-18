-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Create policies for blog image uploads
CREATE POLICY "Blog images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

-- Enable realtime for posts table
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.posts;

-- Create active_writers table for real-time tracking
CREATE TABLE public.active_writers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on active_writers
ALTER TABLE public.active_writers ENABLE ROW LEVEL SECURITY;

-- Create policies for active writers
CREATE POLICY "Active writers are viewable by everyone" 
ON public.active_writers 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own active writer status" 
ON public.active_writers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own active writer status" 
ON public.active_writers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own active writer status" 
ON public.active_writers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable realtime for active_writers table
ALTER TABLE public.active_writers REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.active_writers;

-- Create function to update last_seen timestamp
CREATE OR REPLACE FUNCTION public.update_writer_activity(user_id UUID, display_name TEXT, avatar_url TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.active_writers (user_id, display_name, avatar_url, last_seen)
  VALUES (user_id, display_name, avatar_url, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_seen = now(),
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url;
END;
$$;

-- Create function to clean up inactive writers (older than 5 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_inactive_writers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.active_writers
  WHERE last_seen < now() - interval '5 minutes';
END;
$$;