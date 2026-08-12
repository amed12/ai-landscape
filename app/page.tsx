import Link from "next/link";

const roles = [
  { label: "Developer / Engineer", icon: "💻", active: true },
  { label: "Designer / Creative", icon: "🎨", active: false },
  { label: "Product Manager", icon: "📋", active: false },
  { label: "Marketer / Growth", icon: "📈", active: false },
  { label: "Executive / Leader", icon: "🏢", active: false },
  { label: "Researcher / Student", icon: "🔬", active: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">⚡ AI Landscape</span>
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Explore
          </Link>
          <a href="#roles" className="text-sm text-gray-600 hover:text-gray-900">
            Roles
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Updates
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            About
          </a>
          <Link
            href="/dashboard"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#0f0f1a] py-24 px-8 text-center">
        <span className="inline-block rounded-full bg-indigo-900/60 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6">
          ✨ Updated Every Day
        </span>
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          AI Tools. Your Role. Today.
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Stop drowning in AI news. Get a curated, daily-refreshed directory of
          AI tools filtered for your specific role — with relevance scores that
          actually mean something.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 mb-4"
        >
          Explore for Developers →
        </Link>
        <div>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300">
            or browse all tools
          </Link>
        </div>
      </section>

      {/* Role cards */}
      <section id="roles" className="py-20 px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">I am a...</h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          Choose your role to get a tailored AI tools view
        </p>
        <div className="grid grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.label} className="relative">
              {role.active ? (
                <Link
                  href="/dashboard"
                  className="flex flex-col items-center gap-3 rounded-xl border-2 border-indigo-600 bg-indigo-50 p-6 text-center hover:bg-indigo-100 transition-colors"
                >
                  <span className="text-3xl">{role.icon}</span>
                  <span className="font-semibold text-indigo-800">{role.label}</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center opacity-70 cursor-not-allowed">
                  <span className="text-3xl">{role.icon}</span>
                  <span className="font-semibold text-gray-600">{role.label}</span>
                  <span className="absolute top-3 right-3 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <footer className="bg-[#0f0f1a] py-6 px-8 text-center text-sm text-gray-400">
        500+ tools tracked &nbsp;•&nbsp; 8 categories &nbsp;•&nbsp; Updated daily &nbsp;•&nbsp; Free to explore
      </footer>
    </div>
  );
}
