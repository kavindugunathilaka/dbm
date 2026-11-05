# dbm.lk — DBM Associate (Pvt) Ltd website

Mobile-first marketing site for DBM Associates, architects & building consultants, Pannipitiya.

- `apps/web` — Next.js 16 (App Router, static) + Tailwind CSS v4
- `docs/` — market analysis and site architecture / SEO-GEO-AEO plan

## Develop
```bash
cd apps/web
npm install
npm run dev
```

## Build & run (production / Contabo VPS)
```bash
cd apps/web
docker build -t dbm-web .
docker run -p 3000:3000 dbm-web
```

Company facts (address, phones, Reg. No.) live in `apps/web/src/lib/site.ts`. Keep them in sync with the Google Business Profile.
