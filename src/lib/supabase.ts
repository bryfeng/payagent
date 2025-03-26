import { createClient } from '@supabase/supabase-js';

// Supabase URL from the JWT token (ref field)
const supabaseUrl = 'https://kjcvqvwocgabjyiknzbh.supabase.co';

// Use environment variable for the key
// Next.js requires environment variables to be prefixed with NEXT_PUBLIC_ to be accessible on the client
// If using server components, you can use process.env directly
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 
                   process.env.SUPABASE_KEY || 
                   '';

if (!supabaseKey) {
  console.warn('Missing Supabase key. Please check your environment variables.');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!supabaseKey;
}
