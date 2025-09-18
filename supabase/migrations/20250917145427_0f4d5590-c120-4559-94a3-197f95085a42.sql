-- Fix search path for the functions created earlier
CREATE OR REPLACE FUNCTION public.update_writer_activity(user_id UUID, display_name TEXT, avatar_url TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.cleanup_inactive_writers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.active_writers
  WHERE last_seen < now() - interval '5 minutes';
END;
$$;

-- Create missing trigger for handle_new_user function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();