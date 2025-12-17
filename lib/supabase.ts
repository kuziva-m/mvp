// FIX: Ensure this file is never bundled to the client
import "server-only";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client (server-side only, uses service role key)
// This client has ADMIN privileges and bypasses Row Level Security (RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          business_name: string;
          email: string | null;
          website: string | null;
          phone: string | null;
          industry: string;
          status: string;
          source: string;
          scraped_data: any | null;
          quality_score: number | null;
          email_sent_at: string | null;
          email_opened_at: string | null;
          email_clicked_at: string | null;
          email_replied_at: string | null;
          automation_paused: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          email?: string | null;
          website?: string | null;
          phone?: string | null;
          industry: string;
          status?: string;
          source?: string;
          scraped_data?: any | null;
          quality_score?: number | null;
          email_sent_at?: string | null;
          email_opened_at?: string | null;
          email_clicked_at?: string | null;
          email_replied_at?: string | null;
          automation_paused?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          email?: string | null;
          website?: string | null;
          phone?: string | null;
          industry?: string;
          status?: string;
          source?: string;
          scraped_data?: any | null;
          quality_score?: number | null;
          email_sent_at?: string | null;
          email_opened_at?: string | null;
          email_clicked_at?: string | null;
          email_replied_at?: string | null;
          automation_paused?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
