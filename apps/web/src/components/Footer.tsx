import { Logo } from "./Logo";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink pb-28 pt-14 text-white/80 lg:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo inverted className="h-9 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {site.legalName}. {site.tagline} in Pannipitiya, Sri Lanka.
          </p>
          <p className="mt-3 text-xs text-white/50">Company Reg. No. {site.regNo}</p>
        </div>

        <address className="not-italic">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Contact</h2>
          <p className="mt-4 text-sm leading-relaxed">
            {site.address.street},
            <br />
            {site.address.locality}, Sri Lanka
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {site.phones.map((p) => (
              <li key={p.e164}>
                <a className="font-semibold text-white hover:text-brand" href={`tel:${p.e164}`}>
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
          <a href={site.mapsUrl} target="_blank" rel="noopener" className="mt-3 inline-block text-sm underline underline-offset-4 hover:text-white">
            Open in Google Maps
          </a>
        </address>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-white/50">
            Serving {site.areasServed.slice(0, -1).join(", ")} and all of Sri Lanka.
          </p>
        </div>
      </div>
      <div className="container-x mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} {site.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
