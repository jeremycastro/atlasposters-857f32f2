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
      admin_navigation: {
        Row: {
          created_at: string | null
          created_by: string | null
          group_name: string | null
          group_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          label: string
          order_index: number
          parent_id: string | null
          route: string
          updated_at: string | null
          visible_to_roles: Database["public"]["Enums"]["app_role"][]
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          group_name?: string | null
          group_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          label: string
          order_index?: number
          parent_id?: string | null
          route: string
          updated_at?: string | null
          visible_to_roles?: Database["public"]["Enums"]["app_role"][]
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          group_name?: string | null
          group_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label?: string
          order_index?: number
          parent_id?: string | null
          route?: string
          updated_at?: string | null
          visible_to_roles?: Database["public"]["Enums"]["app_role"][]
        }
        Relationships: [
          {
            foreignKeyName: "admin_navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "admin_navigation"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_files: {
        Row: {
          artwork_id: string
          color_profile: string | null
          dimensions: string | null
          dpi: number | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_primary: boolean | null
          metadata: Json | null
          mime_type: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          artwork_id: string
          color_profile?: string | null
          dimensions?: string | null
          dpi?: number | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_primary?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          artwork_id?: string
          color_profile?: string | null
          dimensions?: string | null
          dpi?: number | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_primary?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artwork_files_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artworks: {
        Row: {
          art_medium: string | null
          artist_name: string | null
          asc_code: string
          brand_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_exclusive: boolean | null
          metadata: Json | null
          original_dimensions: string | null
          partner_id: string
          rights_end_date: string | null
          rights_start_date: string | null
          sequence_number: number
          status: Database["public"]["Enums"]["artwork_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          year_created: number | null
        }
        Insert: {
          art_medium?: string | null
          artist_name?: string | null
          asc_code: string
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_exclusive?: boolean | null
          metadata?: Json | null
          original_dimensions?: string | null
          partner_id: string
          rights_end_date?: string | null
          rights_start_date?: string | null
          sequence_number: number
          status?: Database["public"]["Enums"]["artwork_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          year_created?: number | null
        }
        Update: {
          art_medium?: string | null
          artist_name?: string | null
          asc_code?: string
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_exclusive?: boolean | null
          metadata?: Json | null
          original_dimensions?: string | null
          partner_id?: string
          rights_end_date?: string | null
          rights_start_date?: string | null
          sequence_number?: number
          status?: Database["public"]["Enums"]["artwork_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          year_created?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artworks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artworks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artworks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      asc_history: {
        Row: {
          artwork_id: string | null
          asc_code: string
          assigned_at: string | null
          assigned_by: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["asc_history_status"]
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          artwork_id?: string | null
          asc_code: string
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["asc_history_status"]
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          artwork_id?: string | null
          asc_code?: string
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["asc_history_status"]
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asc_history_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asc_history_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asc_history_voided_by_fkey"
            columns: ["voided_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          accent_color: string | null
          brand_name: string
          brand_story: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          metadata: Json | null
          partner_id: string
          primary_color: string | null
          secondary_color: string | null
          social_links: Json | null
          tagline: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          accent_color?: string | null
          brand_name: string
          brand_story?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          partner_id: string
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          accent_color?: string | null
          brand_name?: string
          brand_story?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          partner_id?: string
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      email_signups: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Relationships: []
      }
      financial_agreements: {
        Row: {
          agreement_type: string
          commission_rate: number | null
          created_at: string | null
          created_by: string | null
          effective_date: string
          expiration_date: string | null
          id: string
          is_active: boolean | null
          minimum_order_value: number | null
          partner_id: string
          payment_terms: string | null
          terms: Json | null
          updated_at: string | null
          wholesale_discount_rate: number | null
        }
        Insert: {
          agreement_type: string
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          effective_date: string
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order_value?: number | null
          partner_id: string
          payment_terms?: string | null
          terms?: Json | null
          updated_at?: string | null
          wholesale_discount_rate?: number | null
        }
        Update: {
          agreement_type?: string
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          effective_date?: string
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order_value?: number | null
          partner_id?: string
          payment_terms?: string | null
          terms?: Json | null
          updated_at?: string | null
          wholesale_discount_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_agreements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_agreements_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      import_queue: {
        Row: {
          id: string
          import_method: Database["public"]["Enums"]["import_method"]
          import_status: Database["public"]["Enums"]["import_status"] | null
          imported_artwork_id: string | null
          imported_product_id: string | null
          mapping_data: Json | null
          notes: string | null
          partner_id: string
          processed_at: string | null
          processed_by: string | null
          queued_at: string | null
          shopify_product_id: string
          suggested_asc_code: string | null
          suggested_product_type_id: string | null
          suggested_variant_codes: Json | null
          validation_errors: Json | null
        }
        Insert: {
          id?: string
          import_method: Database["public"]["Enums"]["import_method"]
          import_status?: Database["public"]["Enums"]["import_status"] | null
          imported_artwork_id?: string | null
          imported_product_id?: string | null
          mapping_data?: Json | null
          notes?: string | null
          partner_id: string
          processed_at?: string | null
          processed_by?: string | null
          queued_at?: string | null
          shopify_product_id: string
          suggested_asc_code?: string | null
          suggested_product_type_id?: string | null
          suggested_variant_codes?: Json | null
          validation_errors?: Json | null
        }
        Update: {
          id?: string
          import_method?: Database["public"]["Enums"]["import_method"]
          import_status?: Database["public"]["Enums"]["import_status"] | null
          imported_artwork_id?: string | null
          imported_product_id?: string | null
          mapping_data?: Json | null
          notes?: string | null
          partner_id?: string
          processed_at?: string | null
          processed_by?: string | null
          queued_at?: string | null
          shopify_product_id?: string
          suggested_asc_code?: string | null
          suggested_product_type_id?: string | null
          suggested_variant_codes?: Json | null
          validation_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "import_queue_imported_artwork_id_fkey"
            columns: ["imported_artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_queue_imported_product_id_fkey"
            columns: ["imported_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_queue_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_queue_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_queue_shopify_product_id_fkey"
            columns: ["shopify_product_id"]
            isOneToOne: false
            referencedRelation: "shopify_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_queue_suggested_product_type_id_fkey"
            columns: ["suggested_product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string | null
          designation: string
          id: string
          is_primary: boolean | null
          partner_id: string
          postal_code: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string | null
          designation: string
          id?: string
          is_primary?: boolean | null
          partner_id: string
          postal_code: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string | null
          designation?: string
          id?: string
          is_primary?: boolean | null
          partner_id?: string
          postal_code?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_addresses_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_agreements: {
        Row: {
          advance_amount: number | null
          advance_balance: number | null
          advance_recoupment_rate: number | null
          agreement_document_path: string | null
          agreement_type: string
          calculation_basis: string | null
          commission_rate: number | null
          created_at: string | null
          created_by: string | null
          effective_date: string
          expiration_date: string | null
          flat_fee_amount: number | null
          id: string
          marketing_attribution_cap_percent: number | null
          partner_id: string
          payment_model: Database["public"]["Enums"]["payment_model"] | null
          payment_period: string | null
          royalty_rate: number | null
          status: string | null
          terms: Json | null
          updated_at: string | null
        }
        Insert: {
          advance_amount?: number | null
          advance_balance?: number | null
          advance_recoupment_rate?: number | null
          agreement_document_path?: string | null
          agreement_type: string
          calculation_basis?: string | null
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          effective_date: string
          expiration_date?: string | null
          flat_fee_amount?: number | null
          id?: string
          marketing_attribution_cap_percent?: number | null
          partner_id: string
          payment_model?: Database["public"]["Enums"]["payment_model"] | null
          payment_period?: string | null
          royalty_rate?: number | null
          status?: string | null
          terms?: Json | null
          updated_at?: string | null
        }
        Update: {
          advance_amount?: number | null
          advance_balance?: number | null
          advance_recoupment_rate?: number | null
          agreement_document_path?: string | null
          agreement_type?: string
          calculation_basis?: string | null
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          effective_date?: string
          expiration_date?: string | null
          flat_fee_amount?: number | null
          id?: string
          marketing_attribution_cap_percent?: number | null
          partner_id?: string
          payment_model?: Database["public"]["Enums"]["payment_model"] | null
          payment_period?: string | null
          royalty_rate?: number | null
          status?: string | null
          terms?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_agreements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_agreements_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_assets: {
        Row: {
          asset_type: string
          brand_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          partner_id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          asset_type: string
          brand_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          partner_id: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          asset_type?: string
          brand_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          partner_id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_assets_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_assets_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_assets_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_contacts: {
        Row: {
          country_code: string | null
          created_at: string | null
          designation: string | null
          email: string
          first_name: string
          full_name: string | null
          id: string
          is_primary: boolean | null
          last_name: string | null
          mobile_phone: string | null
          notes: string | null
          partner_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          designation?: string | null
          email: string
          first_name: string
          full_name?: string | null
          id?: string
          is_primary?: boolean | null
          last_name?: string | null
          mobile_phone?: string | null
          notes?: string | null
          partner_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string
          first_name?: string
          full_name?: string | null
          id?: string
          is_primary?: boolean | null
          last_name?: string | null
          mobile_phone?: string | null
          notes?: string | null
          partner_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_contacts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          atlas_manager_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          partner_name: string
          status: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          atlas_manager_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          partner_name: string
          status?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          atlas_manager_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          partner_name?: string
          status?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_atlas_manager_id_fkey"
            columns: ["atlas_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          sort_order: number
          type_code: string
          type_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number
          type_code: string
          type_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number
          type_code?: string
          type_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          barcode: string | null
          cost_price: number | null
          created_at: string | null
          full_sku: string
          id: string
          inventory_qty: number | null
          is_active: boolean | null
          metadata: Json | null
          product_id: string
          reorder_point: number | null
          reserved_qty: number | null
          retail_price: number | null
          updated_at: string | null
          variant_code: string
          variant_name: string | null
          weight_oz: number | null
          wholesale_price: number | null
        }
        Insert: {
          barcode?: string | null
          cost_price?: number | null
          created_at?: string | null
          full_sku: string
          id?: string
          inventory_qty?: number | null
          is_active?: boolean | null
          metadata?: Json | null
          product_id: string
          reorder_point?: number | null
          reserved_qty?: number | null
          retail_price?: number | null
          updated_at?: string | null
          variant_code: string
          variant_name?: string | null
          weight_oz?: number | null
          wholesale_price?: number | null
        }
        Update: {
          barcode?: string | null
          cost_price?: number | null
          created_at?: string | null
          full_sku?: string
          id?: string
          inventory_qty?: number | null
          is_active?: boolean | null
          metadata?: Json | null
          product_id?: string
          reorder_point?: number | null
          reserved_qty?: number | null
          retail_price?: number | null
          updated_at?: string | null
          variant_code?: string
          variant_name?: string | null
          weight_oz?: number | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          artwork_id: string
          base_sku: string
          created_at: string | null
          created_by: string | null
          description: string | null
          discontinue_date: string | null
          id: string
          is_active: boolean | null
          launch_date: string | null
          metadata: Json | null
          product_name: string
          product_type_id: string
          updated_at: string | null
        }
        Insert: {
          artwork_id: string
          base_sku: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discontinue_date?: string | null
          id?: string
          is_active?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          product_name: string
          product_type_id: string
          updated_at?: string | null
        }
        Update: {
          artwork_id?: string
          base_sku?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discontinue_date?: string | null
          id?: string
          is_active?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          product_name?: string
          product_type_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          created_at: string | null
          customer_since: string | null
          email: string
          full_name: string | null
          id: string
          last_login_at: string | null
          last_synced_at: string | null
          loyalty_points: number | null
          partner_company_name: string | null
          partner_contact_email: string | null
          partner_since: string | null
          partner_status: string | null
          partner_type: string | null
          partner_website: string | null
          phone: string | null
          platform_customer_ids: Json | null
          preferences: Json | null
          shipping_address: Json | null
          shopify_customer_id: string | null
          sync_status: string | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string | null
          customer_since?: string | null
          email: string
          full_name?: string | null
          id: string
          last_login_at?: string | null
          last_synced_at?: string | null
          loyalty_points?: number | null
          partner_company_name?: string | null
          partner_contact_email?: string | null
          partner_since?: string | null
          partner_status?: string | null
          partner_type?: string | null
          partner_website?: string | null
          phone?: string | null
          platform_customer_ids?: Json | null
          preferences?: Json | null
          shipping_address?: Json | null
          shopify_customer_id?: string | null
          sync_status?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string | null
          customer_since?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          last_synced_at?: string | null
          loyalty_points?: number | null
          partner_company_name?: string | null
          partner_contact_email?: string | null
          partner_since?: string | null
          partner_status?: string | null
          partner_type?: string | null
          partner_website?: string | null
          phone?: string | null
          platform_customer_ids?: Json | null
          preferences?: Json | null
          shipping_address?: Json | null
          shopify_customer_id?: string | null
          sync_status?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          blocks: string[] | null
          checklist: Json | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          depends_on: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          milestone: string | null
          milestone_id: string | null
          notes: string | null
          order_index: number | null
          phase: string | null
          phase_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          blocks?: string[] | null
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          depends_on?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          milestone?: string | null
          milestone_id?: string | null
          notes?: string | null
          order_index?: number | null
          phase?: string | null
          phase_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          blocks?: string[] | null
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          depends_on?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          milestone?: string | null
          milestone_id?: string | null
          notes?: string | null
          order_index?: number | null
          phase?: string | null
          phase_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "roadmap_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "roadmap_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_milestones: {
        Row: {
          completed_date: string | null
          created_at: string | null
          deliverables: Json | null
          description: string | null
          due_date: string | null
          id: string
          milestone_number: string
          name: string
          order_index: number
          phase_id: string
          status: Database["public"]["Enums"]["roadmap_milestone_status"] | null
          success_metrics: Json | null
          target_week: number | null
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          deliverables?: Json | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_number: string
          name: string
          order_index: number
          phase_id: string
          status?:
            | Database["public"]["Enums"]["roadmap_milestone_status"]
            | null
          success_metrics?: Json | null
          target_week?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          deliverables?: Json | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_number?: string
          name?: string
          order_index?: number
          phase_id?: string
          status?:
            | Database["public"]["Enums"]["roadmap_milestone_status"]
            | null
          success_metrics?: Json | null
          target_week?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_milestones_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "roadmap_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_phases: {
        Row: {
          actual_end_date: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number
          phase_number: number
          start_date: string | null
          status: Database["public"]["Enums"]["roadmap_phase_status"] | null
          target_end_date: string | null
          updated_at: string | null
          version_id: string
        }
        Insert: {
          actual_end_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index: number
          phase_number: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_phase_status"] | null
          target_end_date?: string | null
          updated_at?: string | null
          version_id: string
        }
        Update: {
          actual_end_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          phase_number?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_phase_status"] | null
          target_end_date?: string | null
          updated_at?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_phases_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "roadmap_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_versions: {
        Row: {
          content_markdown: string | null
          created_at: string | null
          description: string | null
          id: string
          release_date: string | null
          status: Database["public"]["Enums"]["roadmap_version_status"] | null
          title: string
          updated_at: string | null
          version: string
        }
        Insert: {
          content_markdown?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          release_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_version_status"] | null
          title: string
          updated_at?: string | null
          version: string
        }
        Update: {
          content_markdown?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          release_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_version_status"] | null
          title?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      shopify_products: {
        Row: {
          handle: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          product_type: string | null
          raw_data: Json | null
          shopify_product_id: string
          shopify_store_id: string
          shopify_variant_id: string | null
          tags: string[] | null
          title: string
          vendor: string | null
        }
        Insert: {
          handle?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          product_type?: string | null
          raw_data?: Json | null
          shopify_product_id: string
          shopify_store_id: string
          shopify_variant_id?: string | null
          tags?: string[] | null
          title: string
          vendor?: string | null
        }
        Update: {
          handle?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          product_type?: string | null
          raw_data?: Json | null
          shopify_product_id?: string
          shopify_store_id?: string
          shopify_variant_id?: string | null
          tags?: string[] | null
          title?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_products_shopify_store_id_fkey"
            columns: ["shopify_store_id"]
            isOneToOne: false
            referencedRelation: "shopify_stores"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_stores: {
        Row: {
          access_token_encrypted: string | null
          connected_at: string | null
          connected_by: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          metadata: Json | null
          partner_id: string
          shop_name: string | null
          shopify_store_id: string | null
          store_domain: string
          store_type: Database["public"]["Enums"]["store_type"] | null
          sync_settings: Json | null
        }
        Insert: {
          access_token_encrypted?: string | null
          connected_at?: string | null
          connected_by?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          partner_id: string
          shop_name?: string | null
          shopify_store_id?: string | null
          store_domain: string
          store_type?: Database["public"]["Enums"]["store_type"] | null
          sync_settings?: Json | null
        }
        Update: {
          access_token_encrypted?: string | null
          connected_at?: string | null
          connected_by?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          partner_id?: string
          shop_name?: string | null
          shopify_store_id?: string | null
          store_domain?: string
          store_type?: Database["public"]["Enums"]["store_type"] | null
          sync_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_stores_connected_by_fkey"
            columns: ["connected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopify_stores_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_sync_map: {
        Row: {
          created_at: string | null
          id: string
          last_sync_at: string | null
          last_sync_error: string | null
          shopify_product_id: string
          shopify_store_id: string
          shopify_variant_id: string
          sync_direction: Database["public"]["Enums"]["sync_direction"] | null
          sync_settings: Json | null
          sync_status: Database["public"]["Enums"]["sync_status"] | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          last_sync_error?: string | null
          shopify_product_id: string
          shopify_store_id: string
          shopify_variant_id: string
          sync_direction?: Database["public"]["Enums"]["sync_direction"] | null
          sync_settings?: Json | null
          sync_status?: Database["public"]["Enums"]["sync_status"] | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          last_sync_error?: string | null
          shopify_product_id?: string
          shopify_store_id?: string
          shopify_variant_id?: string
          sync_direction?: Database["public"]["Enums"]["sync_direction"] | null
          sync_settings?: Json | null
          sync_status?: Database["public"]["Enums"]["sync_status"] | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_sync_map_shopify_store_id_fkey"
            columns: ["shopify_store_id"]
            isOneToOne: false
            referencedRelation: "shopify_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopify_sync_map_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      sku_history: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          changes: Json | null
          id: string
          ip_address: unknown
          reason: string | null
          sku: string
          user_agent: string | null
          variant_id: string | null
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          changes?: Json | null
          id?: string
          ip_address?: unknown
          reason?: string | null
          sku: string
          user_agent?: string | null
          variant_id?: string | null
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          changes?: Json | null
          id?: string
          ip_address?: unknown
          reason?: string | null
          sku?: string
          user_agent?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sku_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sku_history_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_log: {
        Row: {
          duration_ms: number | null
          error_code: string | null
          error_message: string | null
          id: string
          operation: string
          response_data: Json | null
          status: string
          sync_map_id: string | null
          sync_payload: Json | null
          sync_type: string
          synced_at: string | null
          synced_by: string | null
        }
        Insert: {
          duration_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          operation: string
          response_data?: Json | null
          status: string
          sync_map_id?: string | null
          sync_payload?: Json | null
          sync_type: string
          synced_at?: string | null
          synced_by?: string | null
        }
        Update: {
          duration_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          operation?: string
          response_data?: Json | null
          status?: string
          sync_map_id?: string | null
          sync_payload?: Json | null
          sync_type?: string
          synced_at?: string | null
          synced_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_sync_map_id_fkey"
            columns: ["sync_map_id"]
            isOneToOne: false
            referencedRelation: "shopify_sync_map"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_log_synced_by_fkey"
            columns: ["synced_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_activity: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          task_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          task_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_activity_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_sessions: {
        Row: {
          active_role: Database["public"]["Enums"]["app_role"]
          id: string
          last_activity_at: string | null
          session_started_at: string | null
          user_id: string
        }
        Insert: {
          active_role: Database["public"]["Enums"]["app_role"]
          id?: string
          last_activity_at?: string | null
          session_started_at?: string | null
          user_id: string
        }
        Update: {
          active_role?: Database["public"]["Enums"]["app_role"]
          id?: string
          last_activity_at?: string | null
          session_started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_attributes: {
        Row: {
          created_at: string | null
          id: string
          position: number | null
          variant_code_id: string
          variant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          position?: number | null
          variant_code_id: string
          variant_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: number | null
          variant_code_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_attributes_variant_code_id_fkey"
            columns: ["variant_code_id"]
            isOneToOne: false
            referencedRelation: "variant_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_attributes_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          display_value: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          updated_at: string | null
          variant_group_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          display_value: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          updated_at?: string | null
          variant_group_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          display_value?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          updated_at?: string | null
          variant_group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_codes_variant_group_id_fkey"
            columns: ["variant_group_id"]
            isOneToOne: false
            referencedRelation: "variant_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_files: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_primary: boolean | null
          metadata: Json | null
          mime_type: string | null
          sort_order: number | null
          uploaded_at: string | null
          uploaded_by: string | null
          variant_id: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_primary?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          sort_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          variant_id: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_primary?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          sort_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_files_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_groups: {
        Row: {
          allow_multiple: boolean | null
          created_at: string | null
          description: string | null
          group_name: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          product_type_id: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          allow_multiple?: boolean | null
          created_at?: string | null
          description?: string | null
          group_name: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          product_type_id: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          allow_multiple?: boolean | null
          created_at?: string | null
          description?: string | null
          group_name?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          product_type_id?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variant_groups_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      build_full_sku: {
        Args: {
          p_asc_code: string
          p_product_type_code: string
          p_variant_code: string
        }
        Returns: string
      }
      generate_next_asc: { Args: never; Returns: string }
      get_active_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer" | "partner" | "customer"
      artwork_status: "draft" | "active" | "archived" | "discontinued"
      asc_history_status: "assigned" | "voided" | "transferred"
      import_method: "csv" | "syncio" | "api" | "manual"
      import_status: "pending" | "mapped" | "imported" | "error" | "skipped"
      payment_model:
        | "royalty_profit"
        | "royalty_revenue"
        | "flat_fee"
        | "advance"
      roadmap_milestone_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "blocked"
      roadmap_phase_status: "planned" | "in_progress" | "completed" | "on_hold"
      roadmap_version_status: "draft" | "current" | "archived"
      store_type: "atlas_managed" | "partner_owned"
      sync_direction: "atlas_to_shopify" | "shopify_to_atlas" | "bidirectional"
      sync_status: "synced" | "pending" | "error" | "conflict"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "backlog"
        | "todo"
        | "in_progress"
        | "in_review"
        | "blocked"
        | "completed"
        | "cancelled"
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
      app_role: ["admin", "editor", "viewer", "partner", "customer"],
      artwork_status: ["draft", "active", "archived", "discontinued"],
      asc_history_status: ["assigned", "voided", "transferred"],
      import_method: ["csv", "syncio", "api", "manual"],
      import_status: ["pending", "mapped", "imported", "error", "skipped"],
      payment_model: [
        "royalty_profit",
        "royalty_revenue",
        "flat_fee",
        "advance",
      ],
      roadmap_milestone_status: [
        "not_started",
        "in_progress",
        "completed",
        "blocked",
      ],
      roadmap_phase_status: ["planned", "in_progress", "completed", "on_hold"],
      roadmap_version_status: ["draft", "current", "archived"],
      store_type: ["atlas_managed", "partner_owned"],
      sync_direction: ["atlas_to_shopify", "shopify_to_atlas", "bidirectional"],
      sync_status: ["synced", "pending", "error", "conflict"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: [
        "backlog",
        "todo",
        "in_progress",
        "in_review",
        "blocked",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
