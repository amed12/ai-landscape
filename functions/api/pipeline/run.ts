import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  PIPELINE_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const authHeader = request.headers.get("authorization");
  const secret = env.PIPELINE_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, key);

  let body: { tools?: any[]; topics?: any[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tools = Array.isArray(body.tools) ? body.tools : [];
  const topics = Array.isArray(body.topics) ? body.topics : [];

  // Reset is_new_today before upsert so only truly new items get flagged
  await supabase.from("tools").update({ is_new_today: false }).neq("id", 0);

  let toolsAdded = 0;
  let topicsAdded = 0;

  if (tools.length > 0) {
    const { error } = await supabase
      .from("tools")
      .upsert(tools, { onConflict: "slug", ignoreDuplicates: false });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    toolsAdded = tools.length;
  }

  if (topics.length > 0) {
    const { error } = await supabase
      .from("topics")
      .upsert(topics, { onConflict: "slug", ignoreDuplicates: false });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    topicsAdded = topics.length;
  }

  await supabase.from("pipeline_runs").insert({
    status: "success",
    tools_added: toolsAdded,
    topics_added: topicsAdded,
    ran_at: new Date().toISOString(),
  });

  return new Response(
    JSON.stringify({ tools_added: toolsAdded, topics_added: topicsAdded }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
