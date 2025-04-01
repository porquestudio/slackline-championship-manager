
import { createClient } from '@supabase/supabase-js';

// These are just placeholder values until the user connects to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth types
export type UserCredentials = {
  email: string;
  password: string;
};

// Types
export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Championship {
  id: string;
  name: string;
  description?: string;
  date: string;
  location?: string;
  created_by: string;
  created_at: string;
  status: 'draft' | 'active' | 'completed';
}

export interface Athlete {
  id: string;
  name: string;
  championship_id: string;
  category: 'trickline' | 'speedline';
  level: 'beginner' | 'amateur' | 'professional' | 'female';
  bio?: string;
  avatar_url?: string;
}

export interface Trick {
  id: string;
  name: string;
  type: 'technique' | 'height' | 'spin' | 'combo';
  base_points: number;
  description?: string;
}

export interface Performance {
  id: string;
  athlete_id: string;
  championship_id: string;
  match_id: string;
  tricks: PerformanceTrick[];
  total_score: number;
  created_at: string;
}

export interface PerformanceTrick {
  trick_id: string;
  execution_score: number; // 0-10 based on execution quality
}

export interface Match {
  id: string;
  championship_id: string;
  round: number;
  athlete1_id: string;
  athlete2_id: string;
  winner_id?: string;
  next_match_id?: string;
  status: 'pending' | 'in_progress' | 'completed';
}
