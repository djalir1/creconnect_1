import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// In Next.js, we use process.env instead of import.meta.env
// The NEXT_PUBLIC_ prefix allows the browser to see these variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);