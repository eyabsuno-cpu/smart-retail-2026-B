import { createClient } from '@supabase/supabase-js';

// Récupération des clés de ton .env (ou de Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Création du client unique
export const supabase = createClient(supabaseUrl, supabaseAnonKey);