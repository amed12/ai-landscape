export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getTools, getTopics } from "@/lib/supabase/queries";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const [tools, topics] = await Promise.all([getTools(), getTopics()]);
  return <DashboardClient tools={tools} topics={topics} />;
}
