CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL CHECK (type IN ('click', 'pageview', 'duration')),
  path text NOT NULL,
  session_id text NOT NULL,
  element jsonb,
  duration_ms integer,
  referrer text,
  user_agent text,
  ip_hash text
);

CREATE INDEX IF NOT EXISTS events_created_at_idx
  ON public.events (created_at DESC);

CREATE INDEX IF NOT EXISTS events_type_created_at_idx
  ON public.events (type, created_at DESC);

CREATE INDEX IF NOT EXISTS events_path_created_at_idx
  ON public.events (path, created_at DESC);
