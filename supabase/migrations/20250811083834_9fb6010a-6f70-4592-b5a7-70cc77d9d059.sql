
-- Update the handle_new_user function to match the actual profiles table structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, user_type, enrollment_number, court_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    (NEW.raw_user_meta_data->>'role')::user_type,
    NEW.raw_user_meta_data->>'enrollment_number',
    NEW.raw_user_meta_data->>'court_id'
  );
  RETURN NEW;
END;
$$;
