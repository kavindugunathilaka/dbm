# DBM Associates: Competitor & Website Market Analysis (Sri Lanka)

_Prepared 2026-11-05 for the DBM Associate (Pvt) Ltd website build._

## 0. Who DBM is (from Invoice SIG-261101-01)

- **DBM Associate (Pvt) Ltd**, Reg. No. P.V.00227523
- No. 60/1, Digana Road, Palanwatta, Pannipitiya · 074 060 0780 / 070 403 5095
- Acts as **Architect / Architectural Consultancy (Consortium)**. Current job: a proposed warehouse and office facility at Pannala.
- Fee model is RIBA-style staging: Engagement → Schematic → Design Development → Development Approval → Working Drawings → Landscape.

**Positioning:** DBM covers design and approvals, and it does both **commercial/industrial** work (warehouse + office) and residential work. Most Sri Lankan competitors are either "house-plan shops" or large civil contractors. DBM can take the gap between them: **a professional consultancy that takes a client from brief to approved drawings and on to build**.

> Open questions before we build: Does DBM also *construct*, or only design and supervise? Is it CIDA graded, and are its architects SLIA chartered? Which project photos can we use?

---

## 1. Competitor landscape (4 segments)

| Segment | Examples | What their sites do well | Where they're weak |
|---|---|---|---|
| **A. House-plan / design-and-build SMEs** | nara.lk (Nara Engineering, "House Plan Sri Lanka", Vastu-led), hellobuilders.lk (Nugegoda), dpengineering.lk, kedalla.lk, realone.lk, isharahomes.com, gauraconstruction.lk | Rs/sq-ft package tiers (Silver/Gold/Platinum), cost calculators, "2026 cost guide" blog posts, WhatsApp CTAs | Templated WordPress, slow on mobile, thin portfolios, no commercial/industrial work, no credentials shown |
| **B. Content-led SEO plays** | housedesign.lk, snapwerks.lk (architect fee guides), mvivo.lk (complete build guide), lankapropertyweb guides | Rank for informational queries ("house construction cost Sri Lanka 2026", "architect fees"), long-form guides, comparison tables | Few have real project proof; they're lead-gen funnels |
| **C. Chartered-architect practices** | Weeraman Associates, A-N Architects, ICONCAST, Tharanga Hewage, Design Consortium, RMJA, EcoDesign | Strong portfolio photography, SLIA credentials, project write-ups (often on Archello/Architizer) | Weak local SEO, no pricing transparency, few CTAs, little or no Sinhala content |
| **D. Large contractors / industrial builders** | MAGA, Access Engineering, Sanken, Tudawe, NR Engineering (steel warehouses), Flexospan/Kirby | CIDA C1 grade, awards (NCASL, Engineering Excellence), big-project case studies, sector pages | Corporate and impersonal, slow, not built for SMEs or private clients |

**Observed price anchors that competitors publish (2026):**
- Construction: about **Rs 9,500–25,000+ per sq ft** depending on tier (DP Engineering 9.5k/13.5k/18k; Kedalla 10k/13k/23k+; Real One 12k–25k+).
- Design fees: about **Rs 20–100 per sq ft** for a permit-stage house plan (Snapwerks); HouseDesign.lk uses package pricing.

---

## 2. Gaps DBM can own

1. **Commercial and industrial design-to-approval for SMEs.** Warehouses, offices, factories, showrooms. Segment A ignores this work, and Segment D is too big and expensive for these clients. The Pannala project is the flagship case study.
2. **Approval expertise as a product.** UDA vs local-authority routing (UDA for lots > 40 perches and buildings > 4,000 sq ft), plus the documents a chartered architect or engineer must certify. Clients worry about this step, and no competitor site explains it well.
3. **Transparent staged engagement.** Publish the six stages from the invoice, with deliverables for each stage. That builds trust and filters out low-quality leads.
4. **Bilingual (English + Sinhala).** Almost every competitor site is English-only, but many private and SME clients search in Sinhala ("ගෙවල් සැලසුම්", "ගොඩනැගිලි අනුමැතිය").
5. **Local SEO in the south-east suburbs of Colombo.** Pannipitiya, Maharagama, Kottawa, Homagama, Piliyandala, Nugegoda, Boralesgamuwa. In searches, no strong architect site shows up for these suburbs.
6. **Performance and AEO.** Competitor sites are heavy WordPress builds. A fast Next.js site with structured data can win AI-answer citations (ChatGPT, Gemini, Perplexity, AI Overviews).

---

## 3. Recommended sitemap

```
/                         Hero: "From brief to approved drawings to build"; trust strip; sectors; process; projects; CTA
/services
  /architectural-design   (residential, commercial, industrial)
  /approvals              UDA + local authority approvals (strong SEO page)
  /structural-mep         (if offered via the consortium)
  /project-management     (if offered)
  /landscape
/sectors
  /warehouses-industrial
  /offices-commercial
  /residential
/process                  6 stages: deliverables, timeline, what the client provides
/projects                 filterable portfolio → /projects/[slug] case studies (Pannala first)
/cost-guide               Rs/sq-ft ranges plus a calculator (lead magnet)
/insights                 blog: approvals, costs, warehouse design, Vastu FAQ
/about                    team, chartered credentials, Reg. No., CIDA grade
/contact                  form + WhatsApp + map (Pannipitiya) + phone numbers
/si/...                   Sinhala mirror of key pages
```

## 4. Must-have features (the parts that would make this the best site in the segment)

- **Cost estimator** (type, sq ft, finish tier → range), with an option to book a consultation. Every leading SME site has one.
- **Project brief form**: plot size in perches, location, building type, budget band and timeline, sent to email + WhatsApp. Uploads for survey plans and deeds.
- **Case studies** structured as Problem → Design response → Approvals → Outcome, with drawings and before/after images.
- **Trust layer**: Company Reg. No. P.V.00227523, CIDA grade, SLIA/IESL memberships, client logos and testimonials, and a Google Business Profile reviews widget.
- **Click-to-WhatsApp** and click-to-call that stay visible on mobile.
- **Schema**: `LocalBusiness`/`ProfessionalService` (`ArchitecturalFirm`-style), `Service`, `FAQPage`, `Project` as `CreativeWork`, `BreadcrumbList`.
- **Performance budget**: LCP < 2.0 s on a 4G connection in Sri Lanka, AVIF images, no slider carousels.

## 5. Keyword targets (starter set)

| Intent | Keywords |
|---|---|
| Commercial | warehouse design Sri Lanka, warehouse construction cost Sri Lanka, factory building design Sri Lanka, office building architect Sri Lanka |
| Local | architect Pannipitiya, architect Maharagama, house plan Kottawa, building approval Maharagama Urban Council |
| Informational / AEO | UDA building approval process, house plan approval documents Sri Lanka, construction cost per sq ft Sri Lanka 2026, architect fees Sri Lanka |
| Sinhala | ගෙවල් සැලසුම් (house plans), ගොඩනැගිලි අනුමැතිය (building approval), ගබඩා ගොඩනැගිලි (warehouse buildings) |

## 6. Proposed stack

Next.js (App Router, SSG/ISR) + headless CMS for projects/blog (Sanity or Payload) + a small Go API for the lead form, estimator and WhatsApp/email notifications. Deploy on Vercel or Cloudflare. CI: lint, type-check, Playwright smoke tests, Lighthouse CI budget gate.

QA focus: correct output from the estimator at range edges, form validation for Sinhala input and file-upload limits, schema validation, and checks for mobile layout and CLS.

---

### Limitations
- nara.lk, cecb.lk and other `.lk` sites could not be fetched from the research environment because the network policy blocked them. Descriptions are based on search results and third-party listings and need a manual visual review.
- Competitor prices are self-published marketing figures, so they are indicative only.

### Sources
- Nara Engineering listing: https://www.ipaddress.com/website/nara.lk/
- Hello Builders: https://archinect.com/hellobuilders · https://hellobuilders.lk/1-sq-ft-construction-cost-in-sri-lanka-in-2026-hellobuilders-guide/
- DP Engineering packages: https://dpengineering.lk/packages/index.html
- Kedalla packages: https://kedalla.lk/house-construction-packages.html
- Real One: https://www.realone.lk/services/house-construction/
- HouseDesign.lk: https://housedesign.lk/guides/house-construction-cost-sri-lanka-2026/
- Snapwerks architect fees: https://snapwerks.lk/blog/house-plan-cost-sri-lanka
- Isharah Homes: https://www.isharahomes.com/blog/cost-to-build-house-sri-lanka/
- Gaura calculator: https://www.gauraconstruction.lk/construction-cost-calculator
- mvivo guide: https://mvivo.lk/build-a-house-sri-lanka/
- Weeraman Associates: https://vync-04bdc4ce672f4c7e.pages.dev/
- A-N Architects: https://www.srilankabusiness.com/exporters-directory/company-profiles/a-n-architects-pvt-ltd
- ICONCAST: https://architizer.com/firms/iconcast/
- Design Consortium: https://www.srilankabusiness.com/exporters-directory/company-profiles/design-consortium-limited/
- NR Engineering (steel warehouses): https://nr-engineering.ceylond-hq.workers.dev/services
- Flexospan/Kirby: https://www.ft.lk/PropertyConstruction/Flexospan-Steel-Buildings-awarded-mega-warehouse-project-by-Ceylon-Tea-Brokers/10516-664103
- MAGA: https://maga.lk · Awards: https://www.ft.lk/Business/maga-access-sanken-recognised-at-engineering-excellence-awards-2015/34-522805
- CIDA C1 references: https://lmd.lk/prime-constructions/ · https://www.devex.com/organizations/amsk-constructions-pvt-ltd-119285
- UDA approvals: https://www.uda.gov.lk/approval-process.html · https://uda.gov.lk/attachments/invest/Guide%20Lines.pdf
