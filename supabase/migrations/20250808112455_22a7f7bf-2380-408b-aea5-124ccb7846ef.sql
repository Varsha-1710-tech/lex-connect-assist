-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT CHECK (role IN ('admin', 'lawyer', 'judge', 'client')) DEFAULT 'client',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cases table
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'pending', 'closed', 'archived')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_lawyer UUID REFERENCES auth.users(id),
  assigned_judge UUID REFERENCES auth.users(id),
  court_name TEXT,
  next_hearing_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hearings table
CREATE TABLE public.hearings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  virtual_meeting_url TEXT,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case participants table
CREATE TABLE public.case_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('plaintiff', 'defendant', 'witness', 'expert', 'observer')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(case_id, user_id)
);

-- Create communications table
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('note', 'update', 'document', 'reminder')) DEFAULT 'note',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for cases
CREATE POLICY "Users can view cases they are involved in" ON public.cases 
FOR SELECT USING (
  auth.uid() = created_by OR 
  auth.uid() = assigned_lawyer OR 
  auth.uid() = assigned_judge OR
  EXISTS (SELECT 1 FROM public.case_participants WHERE case_id = cases.id AND user_id = auth.uid())
);

CREATE POLICY "Lawyers and admins can create cases" ON public.cases 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('lawyer', 'admin'))
);

CREATE POLICY "Lawyers and judges can update cases" ON public.cases 
FOR UPDATE USING (
  auth.uid() = assigned_lawyer OR 
  auth.uid() = assigned_judge OR
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create policies for hearings
CREATE POLICY "Users can view hearings for their cases" ON public.hearings 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE id = hearings.case_id AND (
      auth.uid() = created_by OR 
      auth.uid() = assigned_lawyer OR 
      auth.uid() = assigned_judge OR
      EXISTS (SELECT 1 FROM public.case_participants WHERE case_id = cases.id AND user_id = auth.uid())
    )
  )
);

CREATE POLICY "Lawyers and judges can create hearings" ON public.hearings 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE id = hearings.case_id AND (
      auth.uid() = assigned_lawyer OR 
      auth.uid() = assigned_judge
    )
  )
);

CREATE POLICY "Lawyers and judges can update hearings" ON public.hearings 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE id = hearings.case_id AND (
      auth.uid() = assigned_lawyer OR 
      auth.uid() = assigned_judge
    )
  )
);

-- Create policies for case participants
CREATE POLICY "Users can view participants for their cases" ON public.case_participants 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE id = case_participants.case_id AND (
      auth.uid() = created_by OR 
      auth.uid() = assigned_lawyer OR 
      auth.uid() = assigned_judge OR
      auth.uid() = case_participants.user_id
    )
  )
);

CREATE POLICY "Lawyers can manage case participants" ON public.case_participants 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE id = case_participants.case_id AND auth.uid() = assigned_lawyer
  )
);

-- Create policies for communications
CREATE POLICY "Users can view communications for their cases" ON public.communications 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE id = communications.case_id AND (
      auth.uid() = created_by OR 
      auth.uid() = assigned_lawyer OR 
      auth.uid() = assigned_judge OR
      EXISTS (SELECT 1 FROM public.case_participants WHERE case_id = cases.id AND user_id = auth.uid())
    )
  ) AND (is_private = false OR sender_id = auth.uid())
);

CREATE POLICY "Users can create communications for their cases" ON public.communications 
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.cases 
    WHERE id = communications.case_id AND (
      auth.uid() = created_by OR 
      auth.uid() = assigned_lawyer OR 
      auth.uid() = assigned_judge OR
      EXISTS (SELECT 1 FROM public.case_participants WHERE case_id = cases.id AND user_id = auth.uid())
    )
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hearings_updated_at
  BEFORE UPDATE ON public.hearings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();