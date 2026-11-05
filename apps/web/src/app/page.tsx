import { BlueprintArt } from "@/components/BlueprintArt";
import { ContactForm } from "@/components/ContactForm";
import { faqs, featuredProject, sectors, services, site, stages, whatsappLink } from "@/lib/site";
import { homeJsonLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }} />

      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-12 pt-8 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            <p className="eyebrow">Pannipitiya · Sri Lanka</p>
            <h1 className="mt-4 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Architects &amp; Building Consultants<span className="text-brand">.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              From first brief to approved drawings: warehouses, offices and homes, designed properly and built right.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="btn-primary">Get a Quote</a>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-ghost">WhatsApp us</a>
            </div>
          </div>
          <div className="blueprint-grid relative rounded-[1.75rem] bg-blueprint p-4 shadow-[0_30px_60px_-30px_rgb(20_20_20/0.5)] sm:p-6">
            <BlueprintArt className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* 2. Answer block (AEO) + 3. Trust strip */}
      <section aria-label="About DBM Associates" className="border-y border-line bg-white">
        <div className="container-x py-10 lg:py-14">
          <p className="max-w-3xl text-xl font-semibold leading-relaxed text-ink-2 sm:text-2xl">
            <strong className="text-ink">{site.legalName}</strong> is an architectural and building consultancy in Pannipitiya. We design
            industrial, commercial and residential buildings and take each project through UDA and local-authority approval.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm lg:grid-cols-4">
            {[
              ["Registered company", site.regNo],
              ["Sectors", "Industrial · Commercial · Residential"],
              ["Process", "6 clear design stages"],
              ["Approvals", "UDA & local authority"],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper p-4 sm:p-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
                <dd className="mt-1 font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="container-x py-16 lg:py-24">
        <p className="eyebrow">What we do</p>
        <h2 className="h2 mt-3 max-w-2xl">Design, approvals and coordination, handled by one team.</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.title} className="card group">
              <span className="font-mono text-xs font-bold text-brand-dark">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-extrabold tracking-tight">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
          <li className="card flex flex-col justify-between bg-ink text-white">
            <p className="text-xl font-extrabold leading-snug">Not sure what you need yet?</p>
            <a href="#contact" className="mt-6 font-bold text-white underline decoration-brand decoration-2 underline-offset-4">
              Tell us about your site →
            </a>
          </li>
        </ul>
      </section>

      {/* 5. Sectors */}
      <section id="sectors" className="bg-ink py-16 text-white lg:py-24">
        <div className="container-x">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Sectors</p>
          <h2 className="h2 mt-3 max-w-2xl">Buildings that work, from warehouse floors to family homes.</h2>
          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {sectors.map((s) => (
              <li key={s.key} className="blueprint-grid rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <SectorIcon kind={s.key} />
                <h3 className="mt-6 text-2xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Process */}
      <section id="process" className="container-x py-16 lg:py-24">
        <p className="eyebrow">How we work</p>
        <h2 className="h2 mt-3 max-w-2xl">Six stages. You always know where your project stands.</h2>
        <p className="mt-4 max-w-2xl text-muted">Fees are staged too: you pay for the stage you are in, not for the whole job up front.</p>
        <ol className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {stages.map((s) => (
            <li key={s.n} className="card relative w-[78%] shrink-0 snap-start sm:w-auto">
              <span className="text-5xl font-extrabold text-brand/90">{s.n}</span>
              <h3 className="mt-2 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 7. Featured project */}
      <section id="projects" className="border-y border-line bg-white py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="blueprint-grid order-2 rounded-[1.75rem] bg-blueprint p-4 sm:p-6 lg:order-1">
            <BlueprintArt className="h-auto w-full" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Current project</p>
            <h2 className="h2 mt-3">
              {featuredProject.title}, {featuredProject.location}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{featuredProject.body}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">Sector</dt>
                <dd className="font-bold">{featuredProject.sector}</dd>
              </div>
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="font-bold">
                  <span className="mr-1.5 inline-block size-2 rounded-full bg-brand align-middle" />
                  {featuredProject.status}
                </dd>
              </div>
            </dl>
            <ul className="mt-6 flex flex-wrap gap-2">
              {featuredProject.scope.map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1 text-xs font-semibold">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Approvals explainer */}
      <section id="approvals" className="container-x py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Building approvals</p>
            <h2 className="h2 mt-3">UDA or local authority? We handle the route for you.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every building in Sri Lanka needs an approved plan before construction starts. Which authority approves it depends on
              your plot and the size of the building. We confirm the route, prepare certified drawings and follow the application through.
            </p>
          </div>
          <ol className="space-y-3">
            {[
              ["Check the route", "Smaller plots and buildings usually go to the Municipal Council, Urban Council or Pradeshiya Sabha. Larger developments are referred to the UDA."],
              ["Prepare the set", "Approved survey plan, site plan, floor plans, sections and elevations, certified as the regulations require."],
              ["Submit & follow up", "We answer queries and make revisions until the approval is issued."],
              ["Start building", "Construction begins only after approval, which avoids fines or demolition orders."],
            ].map(([t, b], i) => (
              <li key={t} className="card flex gap-4 p-5!">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-extrabold">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq" className="border-t border-line bg-paper-2 py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="h2 mt-3">Questions clients ask us.</h2>
          </div>
          <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
            {faqs.map((f, i) => (
              <details key={f.q} className="group px-5 sm:px-6" open={i === 0}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-2xl leading-none text-brand transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Contact */}
      <section id="contact" className="container-x py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Start a project</p>
            <h2 className="h2 mt-3">Tell us about your site.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Share the location, plot size and what you want to build. Send the survey plan by WhatsApp if you have it, and we will
              arrange a first meeting.
            </p>
            <ul className="mt-8 space-y-4">
              {site.phones.map((p) => (
                <li key={p.e164}>
                  <a href={`tel:${p.e164}`} className="text-2xl font-extrabold tracking-tight hover:text-brand-dark">
                    {p.display}
                  </a>
                </li>
              ))}
              <li className="text-muted">
                {site.address.street}, {site.address.locality}
                <br />
                <a href={site.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-ink underline underline-offset-4">
                  Get directions
                </a>
              </li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function SectorIcon({ kind }: { kind: string }) {
  const p = { width: 44, height: 44, viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": true } as const;
  if (kind === "industrial")
    return (
      <svg {...p} className="text-brand">
        <path d="M4 42V20l20-10 20 10v22" />
        <path d="M12 42V28h24v14M12 33h24M12 38h24" />
      </svg>
    );
  if (kind === "commercial")
    return (
      <svg {...p} className="text-brand">
        <path d="M8 42V8h22v34M30 18h10v24M4 42h40" />
        <path d="M14 14h4M22 14h0M14 21h4M22 21h2M14 28h4M22 28h2M35 25h0M35 32h0" />
      </svg>
    );
  return (
    <svg {...p} className="text-brand">
      <path d="M6 22 24 8l18 14M10 19v23h28V19" />
      <path d="M20 42V30h8v12" />
    </svg>
  );
}
