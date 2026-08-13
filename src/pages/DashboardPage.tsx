import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTools, getTopics } from "@/lib/supabase/queries";
import type { ToolWithRelevance, Topic } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryDefs = [
  { label: "All Tools", slug: "all" },
  { label: "Code Assistants", slug: "code-assistants" },
  { label: "LLM APIs & Frameworks", slug: "llm-apis-frameworks" },
  { label: "Frontend AI", slug: "frontend-ai" },
  { label: "Backend & Infra AI", slug: "backend-infra-ai" },
  { label: "Testing AI", slug: "testing-ai" },
  { label: "Agent & MCP Frameworks", slug: "agent-mcp-frameworks" },
  { label: "Security AI", slug: "security-ai" },
];

const filters = ["All", "New Today", "Free Tier", "Has API", "Open Source"];

const categorySlugMap: Record<string, string> = {
  "code-assistants": "Code Assistants",
  "llm-apis-frameworks": "LLM APIs & Frameworks",
  "frontend-ai": "Frontend AI",
  "backend-infra-ai": "Backend & Infra AI",
  "testing-ai": "Testing AI",
  "agent-mcp-frameworks": "Agent & MCP Frameworks",
  "security-ai": "Security AI",
};

export default function DashboardPage() {
  const [tools, setTools] = useState<ToolWithRelevance[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const [toolsData, topicsData] = await Promise.all([
          getTools(),
          getTopics(),
        ]);
        setTools(toolsData);
        setTopics(topicsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = categoryDefs.map((cat) => ({
    ...cat,
    count:
      cat.slug === "all"
        ? tools.length
        : tools.filter(
            (t) => t.category_name === categorySlugMap[cat.slug]
          ).length,
  }));

  const filtered = tools.filter((tool) => {
    const catMatch =
      activeCategory === "all" ||
      tool.category_name === categorySlugMap[activeCategory];

    const filterMatch =
      activeFilter === "All" ||
      (activeFilter === "New Today" && tool.is_new_today) ||
      (activeFilter === "Free Tier" && tool.has_free_tier) ||
      (activeFilter === "Has API" && tool.has_api) ||
      (activeFilter === "Open Source" && tool.is_open_source);

    return catMatch && filterMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <Link to="/" className="text-xl font-bold text-gray-900">
          ⚡ AI Landscape
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-sm font-medium text-indigo-600">
            Explore
          </Link>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Roles
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Updates
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            About
          </a>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Sign In
          </button>
        </div>
      </nav>

      {/* Update banner */}
      <div className="bg-green-50 border-b border-green-200 px-8 py-3 text-sm text-green-800">
        🟢 Today, Aug 11 — 8 new tools added relevant for Developers
      </div>

      <div className="flex max-w-screen-xl mx-auto">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-120px)] py-6 px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Categories
          </p>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <button
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left",
                    activeCategory === cat.slug
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "text-xs",
                      activeCategory === cat.slug
                        ? "text-indigo-500"
                        : "text-gray-400"
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Filter chips */}
              <div className="flex gap-2 mb-6">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium border",
                      activeFilter === f
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                    )}
                  >
                    {f === "All" && activeFilter === "All" ? "All ✓" : f}
                  </button>
                ))}
              </div>

              {/* Tool grid */}
              <div className="grid grid-cols-3 gap-4">
                {filtered.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/tools/${tool.slug}`}
                    className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
                  >
                    {tool.is_new_today && (
                      <span className="inline-block rounded-full bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 mb-2">
                        NEW TODAY
                      </span>
                    )}
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    </div>
                    <span className="inline-block rounded-full bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 mb-2">
                      {tool.category_name}
                    </span>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>SE Relevance</span>
                        <span className="font-semibold text-gray-700">
                          {tool.relevanceScore}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-indigo-500"
                          style={{ width: `${tool.relevanceScore}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center text-gray-400 py-16">
                  No tools match the current filter.
                </div>
              )}

              {/* Topics section */}
              {topics.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Topics to Learn
                  </h2>
                  <div className="flex flex-col gap-3">
                    {topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="bg-white rounded-xl border border-gray-200 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span
                              className={cn(
                                "inline-block rounded-full text-xs font-semibold px-2 py-0.5 mb-2",
                                topic.urgency_level === "must_learn"
                                  ? "bg-red-100 text-red-700"
                                  : topic.urgency_level === "trending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-600"
                              )}
                            >
                              {topic.urgency_level === "must_learn"
                                ? "Must Learn"
                                : topic.urgency_level === "trending"
                                ? "Trending"
                                : "Worth Watching"}
                            </span>
                            <h3 className="font-semibold text-gray-900">
                              {topic.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 italic">
                          Why it matters: {topic.why_it_matters}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
