# AI Landscape — Product Backlog

> Last updated: 2026-08-13
> Status legend: `[ ]` Todo · `[~]` In Progress · `[x]` Done

---

## 🚀 Sprint 0 — Security Hardening
> **Goal:** Aman sebelum ada user nyata. Harus selesai sebelum launch.

- [ ] **S0-1** Hapus `.env` dari git history, pindah ke `.env.local`, regenerate Supabase keys
- [ ] **S0-2** Tambah Zod validation di `POST /api/pipeline/run` (sanitize input, limit field length)
- [ ] **S0-3** Tambah React Error Boundary di semua page (fallback UI kalau Supabase down)
- [ ] **S0-4** Setup Sentry free tier — track JS errors + API failures
- [ ] **S0-5** Update README agar reflect Vite + Cloudflare (bukan Next.js)

---

## 👤 Sprint 1 — Auth & User Identity
> **Goal:** User bisa login dan track progress belajarnya.

- [x] **S1-1** Implement Supabase Auth — email signup/login
- [x] **S1-2** Buat halaman `/login` dan `/signup`
- [x] **S1-3** Auth context provider + `useAuth()` hook
- [x] **S1-4** Navbar: tampilkan user email + sign out button
- [x] **S1-5** Tabel `user_topic_progress` + RLS migration
- [x] **S1-6** Topic card: tombol toggle status (Not Started → In Progress → Completed)
- [x] **S1-7** Overall learning progress bar di dashboard
- [ ] **S1-8** Google OAuth — aktifkan di Supabase dashboard + test
- [ ] **S1-9** "Save Tool" button — wire ke tabel `saved_tools`
- [ ] **S1-10** Halaman `/saved` — list tools yang di-save user

---

## 🔍 Sprint 2 — Content & Discovery
> **Goal:** User bisa explore tools dengan mudah, konten tidak ada yang hardcoded.

- [ ] **S2-1** Pagination tools di Dashboard (20/page, load more)
- [ ] **S2-2** Search bar — cari tools by name/description
- [ ] **S2-3** Fix `ToolDetailPage` — ganti hardcoded `keyFeatures` + `roleRelevance` dengan data dari DB
- [ ] **S2-4** Tampilkan `topic_resources` di topic card (links artikel/video/repo)
- [ ] **S2-5** Update banner "Today — X new tools" jadi dinamis dari `pipeline_runs` table
- [ ] **S2-6** Filter "Role" — aktifkan 5 roles (Designer, PM, dll), bukan hanya Developer
- [ ] **S2-7** Halaman `/progress` — ringkasan semua learning status per user

---

## 🤖 Sprint 3 — Pipeline & Data Quality
> **Goal:** Data pipeline menghasilkan konten yang relevan dan akurat otomatis.

- [ ] **S3-1** Tambah source baru ke n8n: Product Hunt API
- [ ] **S3-2** Auto-generate topics via Gemini API (dari GitHub topics tags)
- [ ] **S3-3** Populate `tool_role_relevance` score dari pipeline (sekarang hanya seeded manual)
- [ ] **S3-4** Tambah DB index: `tools.slug`, `tools.category_id`, `tools.is_new_today`
- [ ] **S3-5** Pipeline error retry + Slack alert kalau pipeline gagal
- [ ] **S3-6** Admin dashboard sederhana — approve/reject tools dari pipeline

---

## 📈 Sprint 4 — Growth & Polish
> **Goal:** Siap untuk traffic nyata dan bisa diukur.

- [ ] **S4-1** SEO: meta tags, OG image per tool, sitemap.xml, robots.txt
- [ ] **S4-2** PostHog analytics — track page views, tool clicks, filter usage
- [ ] **S4-3** Email digest mingguan — "Top 10 AI tools this week"
- [ ] **S4-4** Landing page improvement — stats, social proof, better CTA
- [ ] **S4-5** Dark mode
- [ ] **S4-6** PWA support (installable di mobile)

---

## ✅ Launch Criteria (Definition of Done)

Boleh launch kalau semua ini centang:

- [ ] Sprint 0 selesai semua
- [x] Auth berjalan (S1-1 s/d S1-4)
- [x] Learning progress tracker live (S1-5 s/d S1-7)
- [ ] Google OAuth aktif (S1-8)
- [ ] Pagination ada (S2-1)
- [ ] ToolDetailPage tidak ada hardcoded data (S2-3)
- [ ] Error boundary aktif (S0-3)
- [ ] Sentry terpasang (S0-4)
- [ ] Pipeline jalan stabil 3 hari berturut-turut ✓ (running)

---

## 📋 Cara Update Backlog

- Ganti `[ ]` → `[~]` saat mulai mengerjakan
- Ganti `[~]` → `[x]` saat selesai
- Tambah task baru di sprint yang relevan dengan format `**SX-Y** deskripsi`
