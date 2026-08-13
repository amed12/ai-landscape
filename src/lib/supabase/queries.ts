import type { ToolWithRelevance, Topic } from "@/lib/types";
import { createClient } from "./client";

function hasSupabaseEnv() {
  const url = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    !!url &&
    url !== "https://your-project.supabase.co"
  );
}

export async function getTools(): Promise<ToolWithRelevance[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tools")
      .select(`*, tool_role_relevance(score), categories(name)`)
      .order("added_at", { ascending: false });
    if (error || !data) {
      console.warn("Supabase query failed or returned no data:", error);
      return [];
    }
    return data.map((t) => ({
      ...t,
      category_name: t.categories?.name ?? "",
      relevanceScore: t.tool_role_relevance?.[0]?.score ?? 0,
    }));
  } catch (err) {
    console.error("Failed to fetch tools:", err);
    return [];
  }
}

export async function getToolBySlug(slug: string): Promise<ToolWithRelevance | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tools")
      .select(`*, tool_role_relevance(score), categories(name)`)
      .eq("slug", slug)
      .single();
    if (error || !data) {
      console.warn("Supabase query failed or returned no data:", error);
      return null;
    }
    return {
      ...data,
      category_name: data.categories?.name ?? "",
      relevanceScore: data.tool_role_relevance?.[0]?.score ?? 0,
    };
  } catch (err) {
    console.error("Failed to fetch tool:", err);
    return null;
  }
}

export async function getTopics(): Promise<Topic[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) {
      console.warn("Supabase query failed or returned no data:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch topics:", err);
    return [];
  }
}
