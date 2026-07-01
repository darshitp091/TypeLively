// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Verify environment variables
const isPlaceholderUrl = supabaseUrl.includes('placeholder');
const isPlaceholderAnon = supabaseAnonKey.includes('placeholder');
const isPlaceholderService = supabaseServiceKey.includes('placeholder');

export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !isPlaceholderUrl && 
  !isPlaceholderAnon;

export const isSupabaseAdminConfigured = 
  isSupabaseConfigured && 
  supabaseServiceKey && 
  !isPlaceholderService;

// Public client for frontend use (e.g. real-time subscriptions)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

// Admin client for secure backend-only operations (RLS bypass)
export const supabaseAdmin = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseAdminConfigured ? supabaseServiceKey : 'placeholder-service-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
