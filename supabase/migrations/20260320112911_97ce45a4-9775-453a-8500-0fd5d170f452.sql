
DROP POLICY "Authenticated tutors can delete" ON public.table_assignments;
DROP POLICY "Authenticated tutors can insert" ON public.table_assignments;
DROP POLICY "Authenticated tutors can update" ON public.table_assignments;

CREATE POLICY "Anyone can delete assignments" ON public.table_assignments FOR DELETE TO public USING (true);
CREATE POLICY "Anyone can insert assignments" ON public.table_assignments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update assignments" ON public.table_assignments FOR UPDATE TO public USING (true);
