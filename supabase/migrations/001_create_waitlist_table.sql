-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role text NOT NULL CHECK (role IN ('Pfandgeber', 'Abholer')),
    postal_code text NOT NULL CHECK (char_length(postal_code) >= 4 AND char_length(postal_code) <= 6),
    name text,
    email text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_postal_code ON waitlist_signups(postal_code);

-- Enable Row Level Security
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for anon users to INSERT only
CREATE POLICY "Allow anon users to insert waitlist signups"
ON waitlist_signups
FOR INSERT
TO anon
WITH CHECK (true);
