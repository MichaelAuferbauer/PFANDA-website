// ============================================
// Supabase Configuration
// ============================================
// TODO: Trage hier deine Supabase Project URL und Anon Key ein:
// 1. Project URL findest du in Supabase Dashboard → Settings → General
// 2. Anon Key findest du in Supabase Dashboard → Settings → API Keys
//    (verwende einen der "publishable" Keys - z.B. "web" oder "mobile")

const SUPABASE_URL = 'https://qbmykhvivrfswuglkwkv.supabase.co'; // <-- HIER deine Project URL eintragen
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibXlraHZpdnJmc3d1Z2xrd2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Mzg3MzcsImV4cCI6MjA4NDMxNDczN30.QknWaZcfRtBCNtrKOVh0dswBy7GEHzPfeUhvrrohGdg'; // <-- HIER deinen Publishable Key eintragen

// Erstelle Supabase Client
// unpkg lädt die Bibliothek - createClient sollte global verfügbar sein
let supabase;

// Initialisiere Client nach DOM-Load
(function initSupabase() {
    function tryInit() {
        // unpkg macht createClient global verfügbar
        if (typeof createClient !== 'undefined') {
            supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase Client initialisiert');
            return true;
        }
        return false;
    }
    
    // Versuche sofort
    if (!tryInit()) {
        // Falls noch nicht geladen, warte auf window.load
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', function() {
                if (!tryInit()) {
                    setTimeout(tryInit, 500);
                }
            });
        } else {
            setTimeout(tryInit, 100);
        }
    }
})();
