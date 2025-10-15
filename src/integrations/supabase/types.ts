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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      n8n_webhooks: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
          webhook_name: string
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
          webhook_name: string
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
          webhook_name?: string
          webhook_url?: string
        }
        Relationships: []
      }
      subscription_templates: {
        Row: {
          amount_max: number
          amount_min: number
          billing_cycle: string
          category: string | null
          created_at: string | null
          currency: string | null
          id: string
          name: string
          provider: string
        }
        Insert: {
          amount_max: number
          amount_min: number
          billing_cycle: string
          category?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          name: string
          provider: string
        }
        Update: {
          amount_max?: number
          amount_min?: number
          billing_cycle?: string
          category?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          name?: string
          provider?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amazon_nudge_dismissed: boolean | null
          amount: number
          billing_cycle: string
          category: string | null
          count_expired_as_savings: boolean | null
          created_at: string | null
          currency: string | null
          expired_since: string | null
          first_paid_month: string | null
          id: string
          last_payment_date: string | null
          missed_charges: number | null
          name: string
          next_billing_date: string
          notes: string | null
          paid_months_count: number | null
          payment_method: string | null
          pending_change: Json | null
          provider: string
          reactivation_watch: boolean | null
          reminders: Json | null
          retry_window_days: number | null
          saving_events: Json | null
          savings_lifetime: number | null
          savings_month_to_date: number | null
          source: string
          status: string | null
          status_changed_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amazon_nudge_dismissed?: boolean | null
          amount: number
          billing_cycle: string
          category?: string | null
          count_expired_as_savings?: boolean | null
          created_at?: string | null
          currency?: string | null
          expired_since?: string | null
          first_paid_month?: string | null
          id?: string
          last_payment_date?: string | null
          missed_charges?: number | null
          name: string
          next_billing_date: string
          notes?: string | null
          paid_months_count?: number | null
          payment_method?: string | null
          pending_change?: Json | null
          provider: string
          reactivation_watch?: boolean | null
          reminders?: Json | null
          retry_window_days?: number | null
          saving_events?: Json | null
          savings_lifetime?: number | null
          savings_month_to_date?: number | null
          source?: string
          status?: string | null
          status_changed_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amazon_nudge_dismissed?: boolean | null
          amount?: number
          billing_cycle?: string
          category?: string | null
          count_expired_as_savings?: boolean | null
          created_at?: string | null
          currency?: string | null
          expired_since?: string | null
          first_paid_month?: string | null
          id?: string
          last_payment_date?: string | null
          missed_charges?: number | null
          name?: string
          next_billing_date?: string
          notes?: string | null
          paid_months_count?: number | null
          payment_method?: string | null
          pending_change?: Json | null
          provider?: string
          reactivation_watch?: boolean | null
          reminders?: Json | null
          retry_window_days?: number | null
          saving_events?: Json | null
          savings_lifetime?: number | null
          savings_month_to_date?: number | null
          source?: string
          status?: string | null
          status_changed_at?: string | null
          updated_at?: string | null
          user_id?: string
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
