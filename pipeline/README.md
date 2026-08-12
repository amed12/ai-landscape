# Data Pipeline — AI Landscape

## Sources

| Source | What we pull | Frequency |
|--------|-------------|-----------|
| Product Hunt API | New AI tools launched today | Daily |
| HuggingFace Trending | Trending models & Spaces | Daily |
| GitHub Trending | Top AI repos by stars delta | Daily |
| RSS — TechCrunch AI | AI tool announcements | Daily |
| RSS — The Batch (deeplearning.ai) | Curated AI news | Weekly |
| Twitter/X signals | Viral AI tool mentions (keyword + engagement threshold) | Daily |

## Flow

```
Sources
  └─▶ Fetch & normalize (n8n HTTP nodes)
        └─▶ Dedup check against Supabase (slug match)
              └─▶ Upsert tools + topics into Supabase
                    └─▶ Insert pipeline_runs record (status, counts)
                          └─▶ Frontend reads is_new_today flag
```

## n8n Workflow Design

- One n8n workflow per source (6 workflows total).
- A "Coordinator" workflow triggers all 6 via sub-workflow calls, then writes the `pipeline_runs` row.
- Normalization node maps raw API/RSS fields → `tools` schema:
  - `name`, `slug` (slugify), `description`, `website_url`, `category_id` (ML classifier), `has_free_tier`, `is_open_source`
- Role relevance scores are computed by a lightweight scoring function that looks at category + keywords.
- `is_new_today` flag is set to `true` on insert, reset to `false` by a nightly cleanup step.

## Cron Schedule

Runs daily at **06:00 UTC** via n8n scheduler trigger.

Cleanup (reset `is_new_today`) runs at **05:55 UTC** — just before the new run — so the flag is always fresh.

## Environment Variables Required

```
PIPELINE_SECRET=<random secret>          # used to authenticate POST /api/pipeline/run
SUPABASE_SERVICE_ROLE_KEY=<...>          # write access to Supabase
NEXT_PUBLIC_SUPABASE_URL=<...>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<...>
```
