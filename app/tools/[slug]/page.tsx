import Link from "next/link";
import { notFound } from "next/navigation";
import { getTools, getToolBySlug } from "@/lib/supabase/queries";

const roleRelevance = [
  { role: "Developer", score: 92, color: "bg-indigo-500" },
  { role: "Designer", score: 30, color: "bg-purple-400" },
  { role: "Product Manager", score: 50, color: "bg-blue-400" },
  { role: "Marketer", score: 20, color: "bg-pink-400" },
  { role: "Executive", score: 40, color: "bg-orange-400" },
];

const keyFeatures = [
  "Inline code suggestions as you type",
  "Chat interface for code questions",
  "Multi-file context awareness",
  "Supports 70+ programming languages",
  "IDE extensions for VSCode, JetBrains, Vim",
];

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tool, allTools] = await Promise.all([
    getToolBySlug(slug),
    getTools(),
  ]);
  if (!tool) notFound();

  const similar = allTools
    .filter((t) => t.id !== tool.id && t.category_name === tool.category_name)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-gray-900">
          ⚡ AI Landscape
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
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

      {/* Breadcrumb */}
      <div className="px-8 py-3 text-sm text-gray-500 flex items-center gap-2 bg-white border-b border-gray-100">
        <Link href="/dashboard" className="hover:text-indigo-600">
          ← Back
        </Link>
        <span>/</span>
        <span>Developer</span>
        <span>/</span>
        <span>{tool.category_name}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{tool.name}</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-8 py-8">
        {/* Tool header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                {tool.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="rounded-full bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5">
                    {tool.category_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ⭐ 4.8 &nbsp;•&nbsp; 2.4k reviews &nbsp;•&nbsp; by{" "}
                    {tool.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Visit Site →
              </a>
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                🔖 Save
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-6 mt-6 border-t border-gray-100 pt-4 text-sm font-medium">
            {["Overview", "Pricing", "Alternatives", "Reviews", "Changelog"].map(
              (tab) => (
                <button
                  key={tab}
                  className={
                    tab === "Overview"
                      ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                      : "text-gray-500 hover:text-gray-700"
                  }
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">{tool.description}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">Key Features</h2>
              <ul className="space-y-2">
                {keyFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-indigo-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Similar tools */}
            {similar.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Similar Tools</h2>
                <div className="flex gap-4">
                  {similar.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      className="flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 mb-2">
                        {t.name[0]}
                      </div>
                      <p className="font-medium text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Role Relevance</h3>
              <div className="space-y-3">
                {roleRelevance.map(({ role, score, color }) => (
                  <div key={role}>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>{role}</span>
                      <span className="font-semibold">{score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100">
                      <div
                        className={`h-1.5 rounded-full ${color}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Pricing</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {tool.pricing_model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Free Tier</span>
                  <span className="font-medium text-gray-900">
                    {tool.has_free_tier ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Has API</span>
                  <span className="font-medium text-gray-900">
                    {tool.has_api ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Open Source</span>
                  <span className="font-medium text-gray-900">
                    {tool.is_open_source ? "Yes" : "No"}
                  </span>
                </div>
                {tool.stars_github && (
                  <div className="flex justify-between">
                    <span>GitHub Stars</span>
                    <span className="font-medium text-gray-900">
                      {tool.stars_github.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
