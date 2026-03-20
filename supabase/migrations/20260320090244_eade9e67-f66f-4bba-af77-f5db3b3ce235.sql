
-- Table to store pushed question assignments
CREATE TABLE public.table_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL DEFAULT 'default',
  table_number INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (session_id, table_number)
);

-- Enable RLS
ALTER TABLE public.table_assignments ENABLE ROW LEVEL SECURITY;

-- Anyone can read assignments (students need to see them)
CREATE POLICY "Anyone can read assignments"
  ON public.table_assignments FOR SELECT
  USING (true);

-- Anyone can insert/update assignments (tutor pushes without auth)
CREATE POLICY "Anyone can insert assignments"
  ON public.table_assignments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update assignments"
  ON public.table_assignments FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete assignments"
  ON public.table_assignments FOR DELETE
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.table_assignments;
