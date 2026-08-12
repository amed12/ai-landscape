-- Roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0
);

-- Tools
CREATE TABLE tools (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT NOT NULL,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  is_open_source BOOLEAN NOT NULL DEFAULT false,
  has_api BOOLEAN NOT NULL DEFAULT false,
  has_free_tier BOOLEAN NOT NULL DEFAULT false,
  pricing_model TEXT NOT NULL DEFAULT 'unknown',
  stars_github INT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_new_today BOOLEAN NOT NULL DEFAULT false
);

-- Tool role relevance
CREATE TABLE tool_role_relevance (
  tool_id INT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  PRIMARY KEY (tool_id, role_id)
);

-- Topics
CREATE TYPE urgency_level AS ENUM ('must_learn', 'trending', 'worth_watching');

CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  urgency_level urgency_level NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Topic resources
CREATE TYPE resource_type AS ENUM ('article', 'video', 'repo');

CREATE TABLE topic_resources (
  id SERIAL PRIMARY KEY,
  topic_id INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type resource_type NOT NULL
);

-- Topic tools (many-to-many)
CREATE TABLE topic_tools (
  topic_id INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  tool_id INT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (topic_id, tool_id)
);

-- Saved tools (per user)
CREATE TABLE saved_tools (
  user_id UUID NOT NULL,
  tool_id INT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tool_id)
);

-- Pipeline runs
CREATE TABLE pipeline_runs (
  id SERIAL PRIMARY KEY,
  ran_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tools_added INT NOT NULL DEFAULT 0,
  topics_added INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO roles (name, slug, icon, description) VALUES
  ('Developer/Engineer', 'developer', '💻', 'Fullstack, backend, frontend, and platform engineers building software products.');

INSERT INTO categories (name, slug, role_id, sort_order) VALUES
  ('All Tools',               'all-tools',               1, 0),
  ('Code Assistants',         'code-assistants',         1, 1),
  ('LLM APIs & Frameworks',   'llm-apis-frameworks',     1, 2),
  ('Frontend AI',             'frontend-ai',             1, 3),
  ('Backend & Infra AI',      'backend-infra-ai',        1, 4),
  ('Testing AI',              'testing-ai',              1, 5),
  ('Agent & MCP Frameworks',  'agent-mcp-frameworks',    1, 6),
  ('Security AI',             'security-ai',             1, 7);

INSERT INTO tools (name, slug, description, website_url, category_id, is_open_source, has_api, has_free_tier, pricing_model, is_new_today) VALUES
  ('GitHub Copilot', 'github-copilot',
   'AI pair programmer that offers autocomplete-style suggestions as you code, trained on billions of lines of code.',
   'https://github.com/features/copilot', 2, false, false, true, 'freemium', false),

  ('Cursor', 'cursor',
   'AI-first code editor built on VSCode. Chat with your codebase, generate code, and fix bugs using GPT-4 and Claude.',
   'https://cursor.sh', 2, false, false, true, 'freemium', true),

  ('Codeium', 'codeium',
   'Free AI code completion and chat for 70+ languages. Works with all major IDEs including VSCode, JetBrains, and Vim.',
   'https://codeium.com', 2, false, false, true, 'freemium', false),

  ('Claude API', 'claude-api',
   'Anthropic''s API for Claude models. Build production-grade AI features with best-in-class instruction following and long context.',
   'https://anthropic.com/api', 3, false, true, false, 'pay-per-token', false),

  ('OpenAI API', 'openai-api',
   'Access GPT-4o, o3, and embeddings via API. Industry-standard for building AI-powered applications with rich tooling ecosystem.',
   'https://platform.openai.com', 3, false, true, false, 'pay-per-token', false),

  ('Vercel v0', 'vercel-v0',
   'Generate React + Tailwind UI components from text prompts. Designed for rapid frontend prototyping and production-ready output.',
   'https://v0.dev', 4, false, false, true, 'freemium', true),

  ('Playwright AI', 'playwright-ai',
   'AI-assisted browser automation and end-to-end testing. Generate, maintain, and debug Playwright tests using natural language.',
   'https://playwright.dev', 6, true, false, true, 'free', false),

  ('Mastra', 'mastra',
   'TypeScript AI agent framework for building workflows, RAG pipelines, and multi-agent systems with built-in evals.',
   'https://mastra.ai', 7, true, false, true, 'open-source', true),

  ('Semgrep', 'semgrep',
   'Static analysis and SAST tool with AI-powered rule suggestions. Find bugs and security vulnerabilities in code before production.',
   'https://semgrep.dev', 8, true, true, true, 'freemium', false),

  ('HuggingFace', 'huggingface',
   'The AI model hub. Host, fine-tune, and deploy open-source models. Access 500k+ models via Inference API.',
   'https://huggingface.co', 5, true, true, true, 'freemium', false);

INSERT INTO tool_role_relevance (tool_id, role_id, score) VALUES
  (1, 1, 95),
  (2, 1, 93),
  (3, 1, 88),
  (4, 1, 91),
  (5, 1, 90),
  (6, 1, 82),
  (7, 1, 78),
  (8, 1, 85),
  (9, 1, 72),
  (10, 1, 80);

INSERT INTO topics (name, slug, description, why_it_matters, urgency_level, role_id) VALUES
  ('AI Coding Agents & Harnesses', 'ai-coding-agents-harnesses',
   'Autonomous coding agents that plan, edit across files, run tools, and verify their own work — Claude Code, OpenCode, Cursor Agent, and the harnesses that drive them.',
   'The frontier of AI coding has shifted from autocomplete to full agent loops. A capable harness (tool use, sandboxing, self-verification, multi-agent orchestration) now matters as much as the underlying model. Engineers who master an agent harness ship multiples faster than those still copy-pasting from chat.',
   'must_learn', 1),

  ('Open-Weight Frontier Coding Models', 'open-weight-coding-models',
   'Open or open-weight models that rival closed frontier labs on real coding tasks — DeepSeek V4, Qwen3-Coder, Kimi, GLM — runnable via API or self-hosted.',
   'The price/performance gap collapsed in 2025–2026. Models like DeepSeek V4 deliver near-frontier coding quality at a fraction of the cost, and can run in your own infra for data control. Knowing when to route to an open model vs. a closed one is now a core cost and architecture decision.',
   'must_learn', 1),

  ('Model Context Protocol (MCP)', 'model-context-protocol',
   'Anthropic''s open standard for connecting AI models to external data sources and tools via a unified protocol.',
   'MCP is becoming the default integration layer for AI agents. Every major IDE and agent framework is adopting it. Engineers who understand MCP will build more interoperable AI tooling.',
   'must_learn', 1),

  ('Context Engineering', 'context-engineering',
   'The discipline of curating exactly what goes into a model''s context window — retrieval, memory, tool results, compaction, and prompt structure — instead of one-off prompt tricks.',
   'As context windows grew to millions of tokens, the bottleneck moved from what to prompt to what to load and when. Context engineering (memory files, sub-agents, compaction, just-in-time retrieval) is the single highest-leverage skill for getting reliable output from long-running agents.',
   'must_learn', 1),

  ('Reasoning Models & Test-Time Compute', 'reasoning-models-test-time-compute',
   'Models that think before answering by spending extra inference compute on chains of reasoning — the o-series, DeepSeek R-line, and thinking modes in frontier models.',
   'Reasoning models changed the cost/quality tradeoff: you can now trade latency and tokens for accuracy on hard problems. Understanding when to enable thinking, how to budget reasoning tokens, and where it helps (math, code, planning) vs. wastes money is essential for production design.',
   'must_learn', 1),

  ('Multi-Agent Orchestration', 'multi-agent-orchestration',
   'Coordinating multiple specialized agents — planners, workers, verifiers — that fan out, run in parallel, and check each other''s work.',
   'Single agents hit context and reliability limits. Orchestration patterns (supervisor/worker, adversarial verification, pipeline fan-out) unlock tasks too big for one context. This is fast becoming the default architecture for serious agentic systems.',
   'trending', 1),

  ('LLM Evals & Observability', 'llm-evals-observability',
   'Systematic evaluation and monitoring of LLM outputs in production: correctness, latency, cost, and drift.',
   'Shipping LLM features without evals is flying blind. Frameworks like Braintrust, LangSmith, and Mastra Evals are maturing fast — knowing how to set up eval pipelines is a core SE skill.',
   'trending', 1),

  ('Multimodal & Vision-Language Models', 'multimodal-vision-language-models',
   'Models that natively understand and generate across text, images, audio, and video — and agents that can see screens and act on them.',
   'UIs, documents, diagrams, and video are how real work happens. Multimodal models power computer-use agents, document extraction, and design-to-code. Text-only thinking now leaves large capabilities on the table.',
   'trending', 1),

  ('Prompt Injection & AI Security', 'prompt-injection-ai-security',
   'Defending agentic systems against prompt injection, tool-abuse, data exfiltration, and untrusted content that hijacks model behavior.',
   'The moment an agent reads external content and has tools, it becomes an attack surface. As agents gain filesystem, browser, and API access, injection is the top new security risk. Guardrails, sandboxing, and least-privilege tool design are now must-have skills.',
   'trending', 1),

  ('Retrieval-Augmented Generation (RAG)', 'retrieval-augmented-generation',
   'Architecture pattern combining vector search with LLM generation to ground responses in private or up-to-date data.',
   'RAG is now table stakes for enterprise AI features. Understanding chunking strategies, embedding models, and re-ranking will differentiate senior engineers.',
   'worth_watching', 1),

  ('Local & Self-Hosted Inference', 'local-self-hosted-inference',
   'Running open-weight models on your own hardware or VPC with tools like Ollama, vLLM, and llama.cpp — for privacy, cost, and offline use.',
   'Data-sensitive orgs and cost-conscious teams increasingly self-host. Knowing quantization, serving throughput, and GPU economics lets you cut inference bills dramatically and keep data in-house.',
   'worth_watching', 1),

  ('Fine-Tuning & Post-Training', 'fine-tuning-post-training',
   'Adapting base models to your domain via LoRA, instruction tuning, and preference optimization (DPO/RLHF) — plus distillation into smaller models.',
   'When prompting and RAG hit a ceiling, post-training closes the gap. Distilling a big model''s behavior into a cheap fine-tuned small one is a powerful cost lever worth understanding before reaching for it.',
   'worth_watching', 1);

INSERT INTO topic_tools (topic_id, tool_id) VALUES
  (1, 8),
  (2, 4),
  (2, 5),
  (3, 10);
