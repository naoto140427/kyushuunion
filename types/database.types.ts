export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string
          type: 'shikko' | 'shokuho'
          date: string
          start_time: string | null
          end_time: string | null
          destinations: Json | null
          total_distance: number
          etc_fee: number
          holiday_allowance: number
          travel_allowance: number
          status: 'draft' | 'pending' | 'submitted'
          created_at: string
        }
        Insert: {
          id?: string
          type: 'shikko' | 'shokuho'
          date: string
          start_time?: string | null
          end_time?: string | null
          destinations?: Json | null
          total_distance: number
          etc_fee: number
          holiday_allowance: number
          travel_allowance: number
          status?: 'draft' | 'pending' | 'submitted'
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'shikko' | 'shokuho'
          date?: string
          start_time?: string | null
          end_time?: string | null
          destinations?: Json | null
          total_distance?: number
          etc_fee?: number
          holiday_allowance?: number
          travel_allowance?: number
          status?: 'draft' | 'pending' | 'submitted'
          created_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
