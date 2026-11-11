-- Run this once in the Supabase SQL Editor.
-- This table stores the many-to-many relationship between users and courses.
CREATE TABLE IF NOT EXISTS public.favorite_course (
  user_id TEXT NOT NULL,
  course_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorite_course_pkey PRIMARY KEY (user_id, course_id),
  CONSTRAINT favorite_course_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.user_table(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT favorite_course_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES public.course_table(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS favorite_course_course_id_idx
  ON public.favorite_course (course_id);
