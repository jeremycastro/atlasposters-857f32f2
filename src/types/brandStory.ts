import { Database } from "@/integrations/supabase/types";

export type BrandComponentType = Database["public"]["Enums"]["brand_component_type"];
export type BrandStoryStatus = Database["public"]["Enums"]["brand_story_status"];
export type BrandStoryScope = Database["public"]["Enums"]["brand_story_scope"];
export type BrandEventType = Database["public"]["Enums"]["brand_event_type"];
export type BrandAssetType = Database["public"]["Enums"]["brand_asset_type"];
export type BrandExportType = Database["public"]["Enums"]["brand_export_type"];

export interface BrandStoryComponent {
  id: string;
  brand_id: string | null;
  scope: BrandStoryScope;
  component_type: BrandComponentType;
  title: string;
  subtitle: string | null;
  content: string;
  metadata: Record<string, any>;
  status: BrandStoryStatus;
  version_number: number;
  is_current_version: boolean;
  parent_version_id: string | null;
  order_index: number;
  tags: string[];
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrandTimelineEvent {
  id: string;
  brand_id: string | null;
  scope: BrandStoryScope;
  event_type: BrandEventType;
  title: string;
  content: string;
  event_date: string;
  related_components: string[];
  related_tasks: string[];
  featured_image_url: string | null;
  tags: string[];
  is_published: boolean;
  is_archived: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrandStoryAsset {
  id: string;
  component_id: string | null;
  timeline_event_id: string | null;
  asset_type: BrandAssetType;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  description: string | null;
  usage_context: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface BrandStoryExport {
  id: string;
  brand_id: string | null;
  scope: BrandStoryScope;
  export_type: BrandExportType;
  title: string;
  description: string | null;
  included_components: string[];
  file_path: string;
  format: string;
  generated_by: string | null;
  generated_at: string;
}

export interface BrandStoryStats {
  totalComponents: number;
  componentsByType: Record<BrandComponentType, number>;
  componentsByStatus: Record<BrandStoryStatus, number>;
  totalTimelineEvents: number;
  totalAssets: number;
  totalExports: number;
  recentActivity: Array<{
    type: 'component' | 'timeline' | 'asset' | 'export';
    title: string;
    created_at: string;
  }>;
}

export const COMPONENT_TYPE_LABELS: Record<BrandComponentType, string> = {
  origin_story: "Origin Story",
  mission: "Mission Statement",
  vision: "Vision Statement",
  core_value: "Core Value",
  positioning: "Positioning Statement",
  brand_promise: "Brand Promise",
  persona: "Target Persona",
  brand_personality: "Brand Personality",
  voice_guideline: "Voice Guideline",
  messaging_pillar: "Messaging Pillar",
  writing_example: "Writing Example",
  story_narrative: "Brand Story",
  content_guideline: "Content Guideline",
  campaign_template: "Campaign Template",
  seo_keyword: "SEO Keyword"
};

export const STATUS_LABELS: Record<BrandStoryStatus, string> = {
  draft: "Draft",
  in_review: "In Review",
  approved: "Approved",
  archived: "Archived"
};

export const EVENT_TYPE_LABELS: Record<BrandEventType, string> = {
  milestone: "Milestone",
  decision: "Decision",
  insight: "Insight",
  launch: "Launch",
  update: "Update",
  retrospective: "Retrospective"
};
