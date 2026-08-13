export interface Role {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  role_id: number;
  sort_order: number;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  website_url: string;
  category_id: number;
  category_name?: string;
  is_open_source: boolean;
  has_api: boolean;
  has_free_tier: boolean;
  pricing_model: string;
  stars_github: number | null;
  added_at: string;
  updated_at: string;
  is_new_today: boolean;
}

export interface ToolWithRelevance extends Tool {
  relevanceScore: number;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  why_it_matters: string;
  urgency_level: "must_learn" | "trending" | "worth_watching";
  role_id: number;
  created_at: string;
}

export interface TopicProgress {
  id: number;
  user_id: string;
  topic_id: number;
  status: "not_started" | "in_progress" | "completed";
  updated_at: string;
}

export interface TopicResource {
  id: number;
  topic_id: number;
  title: string;
  url: string;
  resource_type: "article" | "video" | "repo";
}
