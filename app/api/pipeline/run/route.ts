export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.PIPELINE_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: { tools?: unknown[]; topics?: unknown[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    toolsAdded = tools.length;
  }

  if (topics.length > 0) {
    const { error } = await supabase
      .from("topics")
      .upsert(topics, { onConflict: "slug", ignoreDuplicates: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    topicsAdded = topics.length;
  }

  await supabase.from("pipeline_runs").insert({
    status: "success",
    tools_added: toolsAdded,
    topics_added: topicsAdded,
    ran_at: new Date().toISOString(),
  });

  return NextResponse.json({ tools_added: toolsAdded, topics_added: topicsAdded });
}
