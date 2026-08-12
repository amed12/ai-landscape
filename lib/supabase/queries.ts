import type { ToolWithRelevance, Topic } from "@/lib/types";
import { mockTools, mockTopics } from "@/lib/mock-data";

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co"
  );
}

export async function getTools(): Promise<ToolWithRelevance[]> {
  if (!hasSupabaseEnv()) return mockTools;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tools")
      .select(
        `*, tool_role_relevance(score), categories(name)`
      )
      .order("added_at", { ascending: false });
    if (error || !data) return mockTools;
    return data.map((t) => ({
      ...t,
      category_name: t.categories?.name ?? "",
      relevanceScore: t.tool_role_relevance?.[0]?.score ?? 0,
    }));
  } catch {
    return mockTools;
  }
}

export async function getToolBySlug(slug: string): Promise<ToolWithRelevance | null> {
  if (!hasSupabaseEnv()) return mockTools.find((t) => t.slug === slug) ?? null;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tools")
      .select(`*, tool_role_relevance(score), categories(name)`)
      .eq("slug", slug)
      .single();
    if (error || !data) return mockTools.find((t) => t.slug === slug) ?? null;
    return {
      ...data,
      category_name: data.categories?.name ?? "",
      relevanceScore: data.tool_role_relevance?.[0]?.score ?? 0,
    };
  } catch {
    return mockTools.find((t) => t.slug === slug) ?? null;
  }
}

export async function getTopics(): Promise<Topic[]> {
  if (!hasSupabaseEnv()) return mockTopics;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return mockTopics;
    return data;
  } catch {
    return mockTopics;
  }
}
