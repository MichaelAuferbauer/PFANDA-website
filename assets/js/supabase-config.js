// ============================================
// Supabase Configuration
// ============================================
// TODO: Trage hier deine Supabase Project URL und Anon Key ein:
// 1. Project URL findest du in Supabase Dashboard → Settings → General
// 2. Anon Key findest du in Supabase Dashboard → Settings → API Keys
//    (verwende einen der "publishable" Keys - z.B. "web" oder "mobile")

const SUPABASE_URL = 'https://vyjlmtmyrsrmefeszode.supabase.com'; // <-- HIER deine Project URL eintragen
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5amxtdG15cnNybWVmZXN6b2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzM3ODksImV4cCI6MjA3NDY0OTc4OX0.44wZXXHAwjeT7khvkKIaPHfarNFUJLzcL53SWq_5dn4'; // <-- HIER deinen Publishable Key eintragen

// Erstelle Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
