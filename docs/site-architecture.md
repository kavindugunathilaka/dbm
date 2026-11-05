# dbm.lk: Site Architecture, Tech Stack & SEO/GEO/AEO Plan

_Mobile-first · self-hosted on a Linux VPS · v1 plan, 2026-11-05_

---

## 1. Principles

1. **Mobile-first.** Design at 360px wide and scale up. Most Sri Lankan visitors arrive by phone from WhatsApp, Facebook or Google.
2. **Lead first.** Every screen is one thumb-tap away from **Call / WhatsApp / Get a quote**.
3. **Answer first (AEO).** Every page opens with a 40–60 word direct answer that an AI engine can quote verbatim.
4. **Static by default.** Pages are pre-rendered HTML with near-zero client JS, so they are fast on a mid-range Android phone over 4G.
5. **Bilingual.** English is the default at `/`, and Sinhala lives at `/si/`. Both get real translations, not machine output.

---

## 2. Sitemap & URL structure

```
/                                   Home
/services                           Services hub
  /services/architectural-design
  /services/building-approvals      ← key SEO/AEO page (UDA + local authority)
  /services/structural-mep          (if offered via consortium)
  /services/project-management      (if offered)
  /services/landscape-design
/sectors
  /sectors/warehouses-industrial    ← differentiator
  /sectors/offices-commercial
  /sectors/residential
/projects                           Portfolio (filter: sector, location, stage)
  /projects/[slug]                  e.g. /projects/warehouse-office-pannala
/process                            The 6 stages (from engagement to landscape)
/cost-guide                         Rs/sq-ft ranges + estimator (lead magnet)
/approvals-guide                    UDA vs local authority, documents, timelines
/insights                           Blog hub
  /insights/[slug]
/areas/[town]                       Only towns with real projects/content (no doorway pages)
/about                              Team, chartered credentials, Reg. No., values
/faq                                Consolidated FAQ
/contact                            Brief form, WhatsApp, map, hours
/privacy  /terms
/si/...                             Sinhala mirror of all of the above
/sitemap.xml  /robots.txt  /llms.txt  /feed.xml
```

Rules:
- Use lowercase, hyphenated slugs that never change. If a slug must change, add a 301 redirect.
- Breadcrumbs are visible and also emitted as `BreadcrumbList` JSON-LD.
- Every page links up to its hub, sideways to two or three siblings, and down to a CTA.

---

## 3. Global layout (all pages)

### Mobile (< 768px)
| Element | Spec |
|---|---|
| **Top bar** | Logo (left, SVG), language toggle `EN / සිං`, hamburger. Height 56px; becomes sticky after scrolling 100px. |
| **Menu** | Full-screen sheet. Large tap targets (≥ 48px). Order: Services, Sectors, Projects, Process, Cost Guide, About, Contact. Phone numbers at the bottom. |
| **Sticky bottom action bar** | Three equal buttons: 📞 **Call** · 💬 **WhatsApp** · 📝 **Get Quote**. Hidden when the footer or the form is in view. Respects `safe-area-inset-bottom`. |
| **Footer** | Contact details: DBM Associate (Pvt) Ltd · 60/1 Digana Road, Palanwatta, Pannipitiya · 074 060 0780 / 070 403 5095 · Reg. No. P.V.00227523. Plus service-area links, socials, a mini sitemap and the copyright line. |

### Desktop (≥ 1024px)
Horizontal nav with a mega-menu for Services and Sectors, plus a persistent "Get a Quote" button. The bottom action bar is replaced by a floating WhatsApp button. Content width is at most 1200px and body text is limited to about 70 characters per line.

---

## 4. Home page: section order

| # | Section | Content | Why |
|---|---|---|---|
| 1 | **Hero** | H1: *Architects & Building Consultants in Pannipitiya*. Sub-line: "From brief to approved drawings to build: warehouses, offices and homes across Sri Lanka." Two CTAs: **Get a Quote** and **WhatsApp us**. One hero photo (LCP image, AVIF, preloaded). No slider. | Keyword in the H1, instant CTA, fast LCP |
| 2 | **Answer block** | Two or three sentences: who DBM is, what it does, where, and since when. | AEO quotable summary |
| 3 | **Trust strip** | Reg. No. · CIDA grade · SLIA/IESL · years active · projects delivered · sectors served | E-E-A-T |
| 4 | **Services** | Five cards, each with an icon, a one-line outcome and a link | Internal links to service pages |
| 5 | **Sectors** | Three large image tiles: Industrial/Warehouse · Commercial/Office · Residential | Differentiates DBM from house-plan shops |
| 6 | **How we work** | Six-stage stepper: Engagement → Schematic → Design Development → Approval → Working Drawings → Landscape. Horizontal swipe on mobile. | Transparency, cuts out low-quality leads |
| 7 | **Featured projects** | Three case-study cards; Pannala goes first | Proof |
| 8 | **Cost estimator teaser** | Building type + sq ft → range, with a "Get exact BOQ" CTA | Lead magnet |
| 9 | **Approvals explainer** | "UDA or local authority? Lots over 40 perches or buildings over 4,000 sq ft go to UDA…" with a link to the guide | AEO plus a common client worry |
| 10 | **Testimonials** | Client quotes with name, project and town, plus a link to the Google rating | Social proof |
| 11 | **FAQ** | 6–8 questions in an accordion (`FAQPage` schema) | AEO, featured snippets |
| 12 | **Latest insights** | Three articles | Freshness signal |
| 13 | **Final CTA + map** | Short brief form (name, phone, project type, location), a map, and the service-area list | Conversion plus local SEO |

---

## 5. Page templates (sections)

**Service page** (`/services/*`)
Hero (H1 + answer block) → What's included → Deliverables per stage → Who it's for → Related projects → Pricing approach → FAQ (4–6) → CTA. Schema: `Service` + `FAQPage` + `BreadcrumbList`.

**Sector page** (`/sectors/*`)
Hero → Sector challenges (for example warehouse clear spans, loading bays, fire codes) → DBM approach → Projects in the sector → Approvals specifics → FAQ → CTA.

**Project case study** (`/projects/[slug]`)
Hero image → Facts panel (client type, location, sq ft, building type, stages, year, status) → Brief / problem → Design response, with drawings → Approvals path → Outcome, with photos and numbers → Client quote → Next project → CTA. Schema: `CreativeWork` / `Project` with `locationCreated`, `creator` = Organization.

**Guide pages** (`/cost-guide`, `/approvals-guide`)
Answer block → Key numbers table (dated "Updated Nov 2026") → Step-by-step → Interactive tool (estimator or approval-route checker) → Sources cited → Author box (chartered architect) → FAQ → CTA.

**Insight article**
Title (question-style where relevant) → TL;DR answer → Body with H2/H3 as questions → Tables and lists → Sources → Author + reviewed-by → Related posts → CTA. Schema: `Article` with `author` (`Person`), `datePublished` and `dateModified`.

**About**
Story → Team (photo, title, chartered status, LinkedIn) → Credentials and registrations → Consortium partners → Values → CTA. Schema: `Organization` + `Person` entries.

**Contact**
Brief form (multi-step on mobile: 1. project type → 2. location and plot size in perches → 3. budget band and timeline → 4. name, phone, optional survey-plan upload) → WhatsApp / call buttons → Map → Hours → Address. Schema: `LocalBusiness` with `geo` and `openingHours`.

---

## 6. Tech stack (VPS self-hosted)

```
                 Cloudflare (DNS, CDN, WAF, Colombo PoP, cache static/images)
                                   │ HTTPS (origin cert)
 ┌──────────── VPS: Contabo Cloud VPS (Singapore), Ubuntu 24.04 ──────────┐
 │  Caddy (reverse proxy, HTTP/3, compression, security headers)          │
 │     ├── web   : Next.js (App Router, SSG/ISR, standalone) + Payload CMS │
 │     │           /admin  → content editing (projects, posts, FAQs)       │
 │     └── api   : Go service (leads, estimator, uploads, notifications)   │
 │  PostgreSQL 17  (Payload content + leads, separate schemas/roles)       │
 │  Uploads volume (media) → nightly sync to Cloudflare R2 / Backblaze B2  │
 │  Umami (analytics) · Uptime Kuma (monitoring)                           │
 └────────────────────────── Docker Compose ──────────────────────────────┘
```

| Layer | Choice | Reason |
|---|---|---|
| Frontend | **Next.js 16 (App Router), TypeScript, React Server Components** | SSG/ISR gives static HTML (best for SEO), plus built-in Metadata API, sitemap and robots |
| Styling | **Tailwind CSS v4** + a small in-house component set (no heavy UI kit) | Small CSS, mobile-first utilities |
| i18n | **next-intl** with `/si` prefix routing and `hreflang` | Proper Sinhala SEO |
| Fonts | `next/font` self-hosted: an English display + body font and **Noto Sans Sinhala** | No layout shift, correct Sinhala rendering |
| CMS | **Payload CMS 3** (runs inside the Next app, Postgres) | Staff add projects and posts without a developer; typed; self-hosted, no SaaS fees |
| Backend API | **Go 1.25+** (chi router, sqlc, pgx) | Lead intake, estimator logic, file-upload validation, rate limiting, email + WhatsApp alerts. Untrusted input stays isolated from the CMS. |
| Database | **PostgreSQL 17** | One database for content and leads, with separate roles |
| Images | `next/image` + sharp (AVIF/WebP), plus the Cloudflare cache | LCP target |
| Forms / anti-spam | Cloudflare Turnstile + server-side validation in Go | No reCAPTCHA weight |
| Email | SMTP via a transactional provider (for example Amazon SES or Brevo), plus `info@dbm.lk` with SPF/DKIM/DMARC | Deliverability |
| Proxy / TLS | **Caddy** (auto HTTPS, HTTP/3) behind Cloudflare (Full-Strict) | Simple configuration, secure defaults |
| Analytics | **Umami** (self-hosted) + Google Search Console + Bing Webmaster Tools | Privacy-friendly and lightweight; Bing matters because ChatGPT search draws on its index |
| CI/CD | GitHub Actions: lint → typecheck → unit tests → build images → push to GHCR → SSH deploy (`docker compose pull && up -d`) → smoke test → automatic rollback on failure | Repeatable deploys |
| Backups | `restic` nightly: Postgres dump + uploads → R2/B2, keep 30 days, monthly restore drill | |
| Hardening | SSH keys only, `ufw` (80/443 limited to Cloudflare IP ranges), `fail2ban`, `unattended-upgrades`, non-root containers | |

### Hosting: Contabo VPS (confirmed)

| Item | Choice |
|---|---|
| Plan | Entry **Cloud VPS** tier (4 vCPU / 8 GB class). This is ample for Next + Payload + Go + Postgres and leaves headroom for Next.js builds. |
| Region | **Asia, Singapore** (the lowest latency to Sri Lanka among Contabo regions). If an India region appears at checkout, compare ping from Colombo before choosing. |
| Storage | NVMe option if offered |
| OS | Ubuntu 24.04 LTS |
| Network | IPv4 + IPv6, behind Cloudflare (proxied) |

**Contabo risks and mitigations:**
- **Shared and variable CPU/network performance.** Mitigations:
  - Pages are static and cached at Cloudflare's edge, so most visitor requests never reach the VPS.
  - Build images in **GitHub Actions** rather than on the VPS; the VPS only pulls and runs them.
- **Slow support and no built-in managed backups.** Mitigations:
  - Off-site `restic` backups to Cloudflare R2 are **mandatory**, not optional.
  - Take a Contabo snapshot before each infrastructure change.
  - Run a monthly restore drill.
- **Basic firewall control.** Mitigations:
  - Use `ufw` on the host, and allow 80/443 only from Cloudflare IP ranges.
  - SSH on a key, with `fail2ban`.
  - Enable the Contabo panel firewall too, if it is available on the plan.
- **No status alerts.** Mitigation: Uptime Kuma, plus an external free monitor (for example UptimeRobot), because Kuma on the same box can't report that the box itself is down.

**First-boot provisioning checklist:**
1. Create a non-root sudo user, install SSH keys, disable password and root login.
2. Turn on `ufw`, `fail2ban` and `unattended-upgrades`, and set the timezone to `Asia/Colombo`.
3. Add 2 GB of swap as a safety net for memory spikes.
4. Install Docker Engine + the Compose plugin, and set log rotation (`max-size=10m`).
5. In Cloudflare DNS, add `A`/`AAAA` records for `dbm.lk` pointing to the VPS IP (proxied). Set SSL to **Full (strict)** with a Cloudflare Origin Certificate in Caddy.
6. Create a deploy user plus a GitHub Actions SSH key restricted to the deploy directory.
7. Set up R2 bucket credentials and the restic cron, then run a test restore.

### Repo layout
```
dbm/
├── apps/
│   ├── web/          Next.js + Payload (collections: Projects, Services, Sectors, Posts, FAQs, Team, Testimonials, Media)
│   └── api/          Go service (cmd/, internal/lead, internal/estimate, internal/notify)
├── deploy/
│   ├── docker-compose.yml
│   ├── Caddyfile
│   └── backup/
├── docs/
└── .github/workflows/
```

---

## 7. SEO / GEO / AEO implementation

### Technical SEO
- Static HTML for every public page, with self-referencing canonicals.
- Generate `sitemap.xml` from the CMS, split by language and including `lastmod`.
- Core Web Vitals budget, enforced in CI by Lighthouse CI:
  - **LCP < 2.0s, INP < 200ms, CLS < 0.05** on a Moto G-class phone over 4G.
  - JS < 90 KB gzipped on content pages.
- Use semantic HTML: one H1 per page, logical H2/H3 nesting, `alt` text on every image, descriptive link text.
- `hreflang`: `en-LK`, `si-LK`, and `x-default` pointing to English.
- Redirect map lives in the CMS.
- Return a real 404 status, and a 410 for removed pages.

### Structured data (JSON-LD, per template)
| Page | Schema |
|---|---|
| All | `Organization` (legalName, alternateName, logo, sameAs, address, telephone, identifier = Reg. No.) + `WebSite` + `BreadcrumbList` |
| Home / Contact | `ProfessionalService` (LocalBusiness subtype) with `geo`, `areaServed`, `openingHoursSpecification` |
| Service | `Service` (provider, areaServed, serviceType) |
| Project | `CreativeWork` with `about`, `locationCreated`, `dateCreated`, images |
| Article / Guide | `Article` + `Person` author with credentials |
| FAQ blocks | `FAQPage` |
| Estimator | `WebApplication` |

Every schema is validated in CI against Schema.org, and the Rich Results test is run manually.

### GEO / AEO: getting cited by ChatGPT, Gemini, Perplexity and AI Overviews
1. **Answer-first blocks** at the top of every page: 40–60 words, factual, with the entity name stated ("DBM Associates is a Pannipitiya-based architectural consultancy…").
2. **Question-shaped H2s** that match real queries ("How long does UDA approval take?").
3. **Facts / evidence panels**: tables of numbers with units, dates and sources (cost per sq ft, approval thresholds, project data). LLMs extract tables well.
4. **Freshness**: "Updated <month year>" on guides, a real `dateModified`, and a quarterly review of cost data.
5. **Entity consistency**: the same name, address and phone across the site, Google Business Profile, Facebook, LinkedIn, Archello and directories, linked through `sameAs`.
6. **Authorship (E-E-A-T)**: named chartered architects as authors, with credential pages.
7. **Crawler access**: `robots.txt` explicitly allows `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `ClaudeBot` and `Google-Extended`. Allowing training crawlers is a business decision; by default we allow them for maximum visibility.
8. **`/llms.txt`**: a curated index of the key pages and facts.
9. **IndexNow** pings (Bing, Yandex) on every publish, run as a Payload hook.
10. **Original data**: publish things competitors can't copy, such as DBM's own cost benchmarks from real BOQs and approval timelines by local authority. These are the assets that earn citations.
11. **Citation testing**: each month, run a fixed prompt set ("best architect for warehouse design in Sri Lanka", "UDA approval process", in English and Sinhala) across the AI engines and log whether DBM is cited.

### Local SEO
- Google Business Profile in the Architect category at Pannipitiya, with photos, services, posts and reviews.
- `/areas/[town]` pages only where DBM has real projects or locally specific approval knowledge (Maharagama UC, Kesbewa UC, Homagama PS and so on).
- Citations in lankayp, findit.lk and the SLIA directory, all with consistent NAP.

---

## 8. QA / test strategy

| Layer | Tooling | What we check |
|---|---|---|
| Unit | Vitest (web), `go test` (api) | Estimator edge cases (0, maximum, decimals, unknown type), lead validation, Sinhala Unicode input |
| Integration | Go + testcontainers (Postgres) | Lead persists, notification sent, rate limit and Turnstile failure paths |
| E2E | Playwright (mobile Pixel + iPhone viewports, desktop) | Nav, sticky bar, multi-step form, file upload limits (type and size), language switch keeps the path |
| SEO | Custom CI script | Every page has a title, a meta description, one H1, a canonical, hreflang pairs, valid JSON-LD, and no broken internal links |
| Performance | Lighthouse CI | Budgets from §7 enforced as a failing gate |
| Accessibility | axe-core in Playwright | WCAG 2.2 AA: contrast, focus order, labels, tap-target size |
| Visual | Playwright screenshots | Regressions at 360 / 768 / 1280 px, with the Sinhala font rendering checked |
| Ops | Uptime Kuma + a post-deploy smoke test | `/`, `/contact`, `/api/health`, a test lead submission |

Edge cases to design for:
- Long Sinhala words breaking card layouts.
- Phone number formats (07x, +94).
- Slow 3G form submits, which need idempotency keys to prevent duplicate leads.
- WhatsApp deep links on desktop.
- CMS editors uploading huge photos (enforce limits and auto-resize).

---

## 9. Build phases

| Phase | Scope |
|---|---|
| **1. Foundation** | Repo scaffold, Docker/Caddy/VPS, CI/CD, design tokens, layout shell (header, menu, bottom bar, footer) |
| **2. Core pages** | Home, Services (5), Sectors (3), Process, About, Contact + Go lead API |
| **3. Proof & tools** | Projects + Pannala case study, cost estimator, approvals guide |
| **4. Sinhala + SEO** | `/si` translations, schema, sitemap, llms.txt, GBP, Search Console / Bing |
| **5. Content engine** | Insights (8–12 launch posts), citation-testing routine, monthly reporting |

### Inputs needed from DBM
1. Is construction offered, or design and supervision only?
2. CIDA grade, and SLIA / IESL memberships of the team.
3. Project photos and drawings (Pannala plus any others), and permission to publish client names.
4. Logo in vector form (SVG/AI) and the brand colours (the red/black "dbm" mark).
5. Team bios and photos.
6. ~~VPS provider~~ Contabo confirmed: need panel access or the VPS IP plus an SSH key for setup.
