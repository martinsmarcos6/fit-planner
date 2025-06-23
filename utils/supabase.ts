import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas!')
  console.warn('Crie um arquivo .env com:')
  console.warn('EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui')
  console.warn('EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui')
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          emoji: string
          is_public: boolean
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          emoji: string
          is_public?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          emoji?: string
          is_public?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      workout_days: {
        Row: {
          id: string
          workout_id: string
          day: string
          division: string
          is_rest_day: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          day: string
          division: string
          is_rest_day?: boolean
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          day?: string
          division?: string
          is_rest_day?: boolean
          order_index?: number
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          workout_day_id: string
          name: string
          sets: number
          reps: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          workout_day_id: string
          name: string
          sets: number
          reps: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          workout_day_id?: string
          name?: string
          sets?: number
          reps?: string
          order_index?: number
          created_at?: string
        }
      }
      weight_records: {
        Row: {
          id: string
          exercise_id: string
          user_id: string
          weight: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          exercise_id: string
          user_id: string
          weight: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          exercise_id?: string
          user_id?: string
          weight?: number
          notes?: string | null
          created_at?: string
        }
      }
      saved_workouts: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          created_at?: string
        }
      }
      workout_likes: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}