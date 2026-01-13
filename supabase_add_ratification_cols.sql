-- Run this in your Supabase SQL Editor to add the necessary columns for ratification

ALTER TABLE agreements 
ADD COLUMN IF NOT EXISTS initial_signature_creator TEXT,
ADD COLUMN IF NOT EXISTS initial_signature_partner TEXT,
ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;

-- If you are using an enum for status, you might need to add 'waiting_signatures' to it.
-- If it's just a text check constraint:
ALTER TABLE agreements DROP CONSTRAINT IF EXISTS agreements_status_check;
ALTER TABLE agreements ADD CONSTRAINT agreements_status_check 
CHECK (status IN ('active', 'archived', 'draft', 'completed', 'failed', 'waiting_signatures'));
