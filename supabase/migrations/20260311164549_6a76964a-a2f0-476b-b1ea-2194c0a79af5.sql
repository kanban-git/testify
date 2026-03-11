ALTER TABLE public.quiz_sessions ADD COLUMN IF NOT EXISTS is_test boolean DEFAULT false;
ALTER TABLE public.quiz_sessions ADD COLUMN IF NOT EXISTS name text;