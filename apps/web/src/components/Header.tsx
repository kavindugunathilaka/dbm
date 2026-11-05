"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] ${
        scrolled || open ? "bg-paper/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur" : "bg-paper"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="DBM Associates home" onClick={() => setOpen(false)}>
          <Logo className="h-7 w-auto" />
          <span className="hidden text-[11px] font-semibold uppercase leading-tight tracking-[0.16em] text-muted sm:block">
            Associates
            <br />
            (Pvt) Ltd
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-semibold">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-ink-2 hover:text-brand-dark">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href="/#contact" className="btn-primary hidden min-h-10! px-5! text-sm lg:inline-flex">
            Get a Quote
          </a>
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-6" aria-hidden>
              <span className={`absolute left-0 h-0.5 w-6 bg-ink transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-6 bg-ink transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col py-6">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center justify-between text-2xl font-extrabold tracking-tight"
                >
                  {item.label}
                  <span aria-hidden className="text-brand">→</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="/#contact" onClick={() => setOpen(false)} className="btn-primary mt-8 w-full">
            Get a Quote
          </a>
          <div className="mt-auto pt-10 text-sm text-muted">
            {site.phones.map((p) => (
              <a key={p.e164} href={`tel:${p.e164}`} className="block py-1 font-semibold text-ink">
                {p.display}
              </a>
            ))}
            <p className="mt-2">{site.address.street}, {site.address.locality}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
