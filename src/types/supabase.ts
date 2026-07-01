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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          description: string | null
          id: string
          metadata: Json | null
          name: string
          order_index: number
          phase_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id: string
          metadata?: Json | null
          name: string
          order_index: number
          phase_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          order_index?: number
          phase_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_events: {
        Row: {
          details: Json | null
          id: string
          timestamp: string
          type: Database["public"]["Enums"]["lifecycle_event_type"]
          user_id: string
          version_id: string
        }
        Insert: {
          details?: Json | null
          id: string
          timestamp: string
          type: Database["public"]["Enums"]["lifecycle_event_type"]
          user_id: string
          version_id: string
        }
        Update: {
          details?: Json | null
          id?: string
          timestamp?: string
          type?: Database["public"]["Enums"]["lifecycle_event_type"]
          user_id?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_available_compositions: {
        Row: {
          channel_id: string
          composition_id: string
        }
        Insert: {
          channel_id: string
          composition_id: string
        }
        Update: {
          channel_id?: string
          composition_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_available_compositions_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_available_compositions_composition_id_fkey"
            columns: ["composition_id"]
            isOneToOne: false
            referencedRelation: "channel_compositions"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_compositions: {
        Row: {
          channel_id: string
          created_by: string
          id: string
          is_user_defined: boolean
          name: string
        }
        Insert: {
          channel_id: string
          created_by: string
          id: string
          is_user_defined: boolean
          name: string
        }
        Update: {
          channel_id?: string
          created_by?: string
          id?: string
          is_user_defined?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_compositions_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          icon: string
          id: string
          label: string
        }
        Insert: {
          icon: string
          id: string
          label: string
        }
        Update: {
          icon?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      composition_definitions: {
        Row: {
          composition_id: string
          definition_id: string
        }
        Insert: {
          composition_id: string
          definition_id: string
        }
        Update: {
          composition_id?: string
          definition_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "composition_definitions_composition_id_fkey"
            columns: ["composition_id"]
            isOneToOne: false
            referencedRelation: "channel_compositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "composition_definitions_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "subtask_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      dcx: {
        Row: {
          created_at: string
          created_by: string
          id: string
          metadata: Json | null
          product: string
          project_name: string
          sub_product: string | null
          tags: string[]
          workspace_id: string
        }
        Insert: {
          created_at: string
          created_by: string
          id: string
          metadata?: Json | null
          product: string
          project_name: string
          sub_product?: string | null
          tags?: string[]
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          metadata?: Json | null
          product?: string
          project_name?: string
          sub_product?: string | null
          tags?: string[]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dcx_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      file_attachments: {
        Row: {
          created_at: string
          created_by: string
          id: string
          source: Database["public"]["Enums"]["file_source"]
          title: string
          url: string
          version_id: string
        }
        Insert: {
          created_at: string
          created_by: string
          id: string
          source: Database["public"]["Enums"]["file_source"]
          title: string
          url: string
          version_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          source?: Database["public"]["Enums"]["file_source"]
          title?: string
          url?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_attachments_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["membership_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          role?: Database["public"]["Enums"]["membership_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["membership_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      phases: {
        Row: {
          icon: Database["public"]["Enums"]["phase_icon_type"]
          id: string
          label: string
          metadata: Json | null
          order_index: number
          updated_at: string | null
          updated_by: string | null
          version_id: string
        }
        Insert: {
          icon: Database["public"]["Enums"]["phase_icon_type"]
          id: string
          label: string
          metadata?: Json | null
          order_index: number
          updated_at?: string | null
          updated_by?: string | null
          version_id: string
        }
        Update: {
          icon?: Database["public"]["Enums"]["phase_icon_type"]
          id?: string
          label?: string
          metadata?: Json | null
          order_index?: number
          updated_at?: string | null
          updated_by?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phases_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      subtask_definition_channels: {
        Row: {
          channel_id: string
          definition_id: string
        }
        Insert: {
          channel_id: string
          definition_id: string
        }
        Update: {
          channel_id?: string
          definition_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtask_definition_channels_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtask_definition_channels_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "subtask_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      subtask_definitions: {
        Row: {
          estimated_minutes: number | null
          id: string
          label: string
        }
        Insert: {
          estimated_minutes?: number | null
          id: string
          label: string
        }
        Update: {
          estimated_minutes?: number | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      subtasks: {
        Row: {
          definition_id: string | null
          done: boolean
          estimated_minutes: number | null
          id: string
          label: string
          metadata: Json | null
          order_index: number
          task_id: string
        }
        Insert: {
          definition_id?: string | null
          done?: boolean
          estimated_minutes?: number | null
          id: string
          label: string
          metadata?: Json | null
          order_index: number
          task_id: string
        }
        Update: {
          definition_id?: string | null
          done?: boolean
          estimated_minutes?: number | null
          id?: string
          label?: string
          metadata?: Json | null
          order_index?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "subtask_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          action_id: string
          channel_id: string
          composition_id: string | null
          date: Json
          generation_context: Json | null
          id: string
          is_small: boolean | null
          message: string
          metadata: Json | null
          missing_data_state: Json
          name: string
          order_index: number
          receiver_id: string
          sender_id: string
          specs_state: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          action_id: string
          channel_id: string
          composition_id?: string | null
          date: Json
          generation_context?: Json | null
          id: string
          is_small?: boolean | null
          message: string
          metadata?: Json | null
          missing_data_state: Json
          name: string
          order_index: number
          receiver_id: string
          sender_id: string
          specs_state: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          action_id?: string
          channel_id?: string
          composition_id?: string | null
          date?: Json
          generation_context?: Json | null
          id?: string
          is_small?: boolean | null
          message?: string
          metadata?: Json | null
          missing_data_state?: Json
          name?: string
          order_index?: number
          receiver_id?: string
          sender_id?: string
          specs_state?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_composition_id_fkey"
            columns: ["composition_id"]
            isOneToOne: false
            referencedRelation: "channel_compositions"
            referencedColumns: ["id"]
          },
        ]
      }
      version_members: {
        Row: {
          is_protected: boolean
          role: string
          user_id: string
          version_id: string
        }
        Insert: {
          is_protected?: boolean
          role: string
          user_id: string
          version_id: string
        }
        Update: {
          is_protected?: boolean
          role?: string
          user_id?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "version_members_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      versions: {
        Row: {
          approved_at: string | null
          communicated_date: string | null
          created_at: string
          created_by: string
          dcx_id: string
          id: string
          in_progress_at: string | null
          last_updated_at: string
          last_updated_by: string
          metadata: Json | null
          ready_at: string | null
          source_backup_id: string | null
          source_template_id: string | null
          source_type: Database["public"]["Enums"]["version_source_type"]
          source_version_id: string | null
          status: Database["public"]["Enums"]["version_status"]
          strategy_context: Json | null
          superseded_at: string | null
          version_number: string
        }
        Insert: {
          approved_at?: string | null
          communicated_date?: string | null
          created_at: string
          created_by: string
          dcx_id: string
          id: string
          in_progress_at?: string | null
          last_updated_at: string
          last_updated_by: string
          metadata?: Json | null
          ready_at?: string | null
          source_backup_id?: string | null
          source_template_id?: string | null
          source_type: Database["public"]["Enums"]["version_source_type"]
          source_version_id?: string | null
          status: Database["public"]["Enums"]["version_status"]
          strategy_context?: Json | null
          superseded_at?: string | null
          version_number: string
        }
        Update: {
          approved_at?: string | null
          communicated_date?: string | null
          created_at?: string
          created_by?: string
          dcx_id?: string
          id?: string
          in_progress_at?: string | null
          last_updated_at?: string
          last_updated_by?: string
          metadata?: Json | null
          ready_at?: string | null
          source_backup_id?: string | null
          source_template_id?: string | null
          source_type?: Database["public"]["Enums"]["version_source_type"]
          source_version_id?: string | null
          status?: Database["public"]["Enums"]["version_status"]
          strategy_context?: Json | null
          superseded_at?: string | null
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "versions_dcx_id_fkey"
            columns: ["dcx_id"]
            isOneToOne: false
            referencedRelation: "dcx"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versions_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      app_user_can_edit: {
        Args: { target_workspace: string }
        Returns: boolean
      }
      app_user_workspace_ids: { Args: never; Returns: string[] }
      app_version_workspace: {
        Args: { target_version: string }
        Returns: string
      }
    }
    Enums: {
      file_source: "google-drive" | "link"
      lifecycle_event_type:
        | "version_created"
        | "in_progress_started"
        | "ready_submitted"
        | "approved"
        | "superseded"
        | "duplicated"
        | "import_applied"
      membership_role: "viewer" | "editor" | "admin"
      phase_icon_type:
        | "awareness"
        | "teaser"
        | "launch"
        | "scale"
        | "maintenance"
      version_source_type: "scratch" | "duplicate" | "import" | "template"
      version_status:
        | "Draft"
        | "In Progress"
        | "Ready for Approval"
        | "Approved"
        | "Superseded"
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
    Enums: {
      file_source: ["google-drive", "link"],
      lifecycle_event_type: [
        "version_created",
        "in_progress_started",
        "ready_submitted",
        "approved",
        "superseded",
        "duplicated",
        "import_applied",
      ],
      membership_role: ["viewer", "editor", "admin"],
      phase_icon_type: [
        "awareness",
        "teaser",
        "launch",
        "scale",
        "maintenance",
      ],
      version_source_type: ["scratch", "duplicate", "import", "template"],
      version_status: [
        "Draft",
        "In Progress",
        "Ready for Approval",
        "Approved",
        "Superseded",
      ],
    },
  },
} as const
