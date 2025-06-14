export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      listening_sessions: {
        Row: {
          created_at: string
          duration: number
          end_time: string | null
          id: string
          start_time: string
          station_id: string | null
          updated_at: string
          user_address: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          duration?: number
          end_time?: string | null
          id?: string
          start_time: string
          station_id?: string | null
          updated_at?: string
          user_address: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          duration?: number
          end_time?: string | null
          id?: string
          start_time?: string
          station_id?: string | null
          updated_at?: string
          user_address?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      rate_limiting: {
        Row: {
          action_count: number | null
          action_type: string
          created_at: string
          id: string
          last_action: string
          updated_at: string
          user_address: string
        }
        Insert: {
          action_count?: number | null
          action_type: string
          created_at?: string
          id?: string
          last_action?: string
          updated_at?: string
          user_address: string
        }
        Update: {
          action_count?: number | null
          action_type?: string
          created_at?: string
          id?: string
          last_action?: string
          updated_at?: string
          user_address?: string
        }
        Relationships: []
      }
      reward_claims: {
        Row: {
          claimed: boolean | null
          created_at: string
          id: string
          listening_time: number
          nonce: number
          reward_amount: string
          signature: string
          tx_hash: string | null
          updated_at: string
          user_address: string
        }
        Insert: {
          claimed?: boolean | null
          created_at?: string
          id?: string
          listening_time: number
          nonce: number
          reward_amount: string
          signature: string
          tx_hash?: string | null
          updated_at?: string
          user_address: string
        }
        Update: {
          claimed?: boolean | null
          created_at?: string
          id?: string
          listening_time?: number
          nonce?: number
          reward_amount?: string
          signature?: string
          tx_hash?: string | null
          updated_at?: string
          user_address?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string
          id: string
          last_reward_claim: string | null
          total_listening_time: number | null
          total_rewards_claimed: string | null
          updated_at: string
          user_address: string
          verified_listening_time: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_reward_claim?: string | null
          total_listening_time?: number | null
          total_rewards_claimed?: string | null
          updated_at?: string
          user_address: string
          verified_listening_time?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_reward_claim?: string | null
          total_listening_time?: number | null
          total_rewards_claimed?: string | null
          updated_at?: string
          user_address?: string
          verified_listening_time?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
