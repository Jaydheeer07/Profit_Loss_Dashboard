/**
 * Supabase client configuration for ProfitLens frontend.
 */
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key
const supabaseUrl = 'https://uiqbuaxglqrrxjqszsrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWJ1YXhnbHFycnhqcXN6c3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzY0ODgsImV4cCI6MjA2MjI1MjQ4OH0.82luYeq_2fbejb0fFp0HjgmlpfpR0q4vEFZ8hht0DoQ';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
