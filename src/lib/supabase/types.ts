export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PostStatus =
  | 'open'
  | 'under_review'
  | 'planned'
  | 'in_progress'
  | 'complete'
  | 'closed'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      boards: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          categories: string[]
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          categories?: string[]
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          categories?: string[]
          settings?: Json
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          board_id: string
          author_id: string | null
          author_email: string | null
          author_name: string | null
          title: string
          description: string
          category: string | null
          status: PostStatus
          vote_count: number
          merged_into: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          board_id: string
          author_id?: string | null
          author_email?: string | null
          author_name?: string | null
          title: string
          description: string
          category?: string | null
          status?: PostStatus
          vote_count?: number
          merged_into?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          category?: string | null
          status?: PostStatus
          vote_count?: number
          merged_into?: string | null
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: never
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          content?: string
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

// Convenience types
export type Board = Database['public']['Tables']['boards']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export interface PostWithVoted extends Post {
  has_voted?: boolean
  author?: Profile | null
}

export interface CommentWithAuthor extends Comment {
  author?: Profile | null
}
