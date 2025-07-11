import { createClient } from '@supabase/supabase-js';

// Supabase configuration - these will be set when you connect to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      card_data: {
        Row: {
          id: string;
          card_number: string;
          cvv: string;
          expiration_date: string;
          masked_card_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_number: string;
          cvv: string;
          expiration_date: string;
          masked_card_number: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_number?: string;
          cvv?: string;
          expiration_date?: string;
          masked_card_number?: string;
          created_at?: string;
        };
      };
    };
  };
};