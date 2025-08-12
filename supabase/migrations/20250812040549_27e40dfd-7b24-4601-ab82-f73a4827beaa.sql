-- Create a default profile for existing user who doesn't have one
INSERT INTO public.profiles (user_id, full_name, user_type)
VALUES ('4c0fe25c-cea9-4d9a-a7b1-aa4262b66972', 'User', 'lawyer')
ON CONFLICT (user_id) DO NOTHING;