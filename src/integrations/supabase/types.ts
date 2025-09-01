export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string
          date: string
          description: string
          id: number
          image_url: string | null
          location: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: number
          image_url?: string | null
          location: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: number
          image_url?: string | null
          location?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      music_queue: {
        Row: {
          artist: string
          created_at: string
          duration: string | null
          id: string
          queue_position: number | null
          requested_by: string
          status: string | null
          thumbnail_url: string | null
          title: string
          tweet_id: string | null
          video_id: string | null
        }
        Insert: {
          artist: string
          created_at?: string
          duration?: string | null
          id?: string
          queue_position?: number | null
          requested_by: string
          status?: string | null
          thumbnail_url?: string | null
          title: string
          tweet_id?: string | null
          video_id?: string | null
        }
        Update: {
          artist?: string
          created_at?: string
          duration?: string | null
          id?: string
          queue_position?: number | null
          requested_by?: string
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          tweet_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "music_queue_tweet_id_fkey"
            columns: ["tweet_id"]
            isOneToOne: false
            referencedRelation: "music_tweets"
            referencedColumns: ["tweet_id"]
          },
        ]
      }
      music_tweets: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string
          handle: string
          id: string
          processed: boolean | null
          song_request: string | null
          tweet_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string
          handle: string
          id?: string
          processed?: boolean | null
          song_request?: string | null
          tweet_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string
          handle?: string
          id?: string
          processed?: boolean | null
          song_request?: string | null
          tweet_id?: string
          username?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string
          created_at: string
          date: string
          id: number
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          date: string
          id?: number
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          id?: number
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      now_playing: {
        Row: {
          id: string
          is_playing: boolean | null
          song_id: string | null
          started_at: string
          updated_at: string
          volume: number | null
        }
        Insert: {
          id?: string
          is_playing?: boolean | null
          song_id?: string | null
          started_at?: string
          updated_at?: string
          volume?: number | null
        }
        Update: {
          id?: string
          is_playing?: boolean | null
          song_id?: string | null
          started_at?: string
          updated_at?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "now_playing_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "music_queue"
            referencedColumns: ["id"]
          },
        ]
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
      stations: {
        Row: {
          created_at: string
          description: string
          genre: string
          id: number
          image_url: string | null
          name: string
          streaming: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          genre: string
          id?: number
          image_url?: string | null
          name: string
          streaming?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          genre?: string
          id?: number
          image_url?: string | null
          name?: string
          streaming?: boolean | null
          updated_at?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
