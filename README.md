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

## Internal tools
- `/tools/bill`: generates a branded A4 **Payment Receipt** or **Invoice** PDF in the browser (pdf-lib; no data is sent to a server, and drafts are kept in the browser's localStorage). The page is `noindex` and disallowed in robots.txt.
  Protected by HTTP Basic Auth in `src/proxy.ts`. Set `TOOLS_USER` and `TOOLS_PASSWORD` env vars (Vercel → Settings → Environment Variables, or in Docker). If they are unset (current demo setup), `/tools/*` is open to anyone with the link.
