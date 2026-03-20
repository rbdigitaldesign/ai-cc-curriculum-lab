
-- Drop overly permissive write policies
DROP POLICY "Anyone can insert assignments" ON public.table_assignments;
DROP POLICY "Anyone can update assignments" ON public.table_assignments;
DROP POLICY "Anyone can delete assignments" ON public.table_assignments;

-- Re-create restricted to authenticated users only
CREATE POLICY "Authenticated tutors can insert"
  ON public.table_assignments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated tutors can update"
  ON public.table_assignments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated tutors can delete"
  ON public.table_assignments FOR DELETE
  TO authenticated
  USING (true);
