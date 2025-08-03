import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      car_preferences: {
        Row: {
          id: string
          user_id: string
          name: string
          budget_min: number
          budget_max: number
          fuel_type: "petrol" | "diesel" | "electric" | "hybrid"
          car_type: "sedan" | "suv" | "hatchback" | "coupe" | "convertible" | "wagon"
          brand_preference: string[] | null
          mileage_min: number | null
          transmission: "manual" | "automatic" | "both" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          budget_min: number
          budget_max: number
          fuel_type: "petrol" | "diesel" | "electric" | "hybrid"
          car_type: "sedan" | "suv" | "hatchback" | "coupe" | "convertible" | "wagon"
          brand_preference?: string[] | null
          mileage_min?: number | null
          transmission?: "manual" | "automatic" | "both" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          budget_min?: number
          budget_max?: number
          fuel_type?: "petrol" | "diesel" | "electric" | "hybrid"
          car_type?: "sedan" | "suv" | "hatchback" | "coupe" | "convertible" | "wagon"
          brand_preference?: string[] | null
          mileage_min?: number | null
          transmission?: "manual" | "automatic" | "both" | null
          updated_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          name: string
          brand: string
          model: string
          year: number
          price: number
          fuel_type: string
          car_type: string
          mileage: number
          transmission: string
          image_url: string | null
          features: string[] | null
          description: string | null
          created_at: string
        }
      }
      saved_recommendations: {
        Row: {
          id: string
          user_id: string
          car_id: string
          preference_id: string | null
          match_score: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          car_id: string
          preference_id?: string | null
          match_score?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          preference_id?: string | null
          match_score?: number | null
          notes?: string | null
        }
      }
    }
  }
}
