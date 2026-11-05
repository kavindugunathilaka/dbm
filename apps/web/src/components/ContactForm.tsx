"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

// Base version: composes a WhatsApp message (no backend yet).
// Phase 2 replaces the submit with POST /api/leads on the Go service.
const types = ["Warehouse / Industrial", "Office / Commercial", "House / Residential", "Other"] as const;

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").replace(/[\s-]/g, "");
    if (name.length < 2) return setError("Please enter your name.");
    if (!/^(\+94|0)?7\d{8}$|^(\+94|0)\d{9}$/.test(phone)) return setError("Please enter a valid Sri Lankan phone number.");
    setError(null);

    const lines = [
      "Hello DBM Associates, I'd like a quote.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Project: ${f.get("type")}`,
      f.get("location") ? `Location: ${f.get("location")}` : "",
      f.get("message") ? `Details: ${f.get("message")}` : "",
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
  }

  const field = "mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none";
  const label = "block text-sm font-bold text-ink";

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-5! sm:p-7!">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Your name
          <input name="name" autoComplete="name" required className={field} placeholder="Full name" />
        </label>
        <label className={label}>
          Phone / WhatsApp
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required className={field} placeholder="07X XXX XXXX" />
        </label>
      </div>
      <label className={label}>
        Project type
        <select name="type" className={field} defaultValue={types[0]}>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className={label}>
        Site location <span className="font-normal text-muted">(town)</span>
        <input name="location" className={field} placeholder="e.g. Maharagama" />
      </label>
      <label className={label}>
        Tell us about the project <span className="font-normal text-muted">(optional)</span>
        <textarea name="message" rows={3} className={field} placeholder="Plot size in perches, floor area, budget, timeline…" />
      </label>
      {error && (
        <p role="alert" className="rounded-lg bg-brand/10 px-3 py-2 text-sm font-semibold text-brand-dark">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary w-full">
        Send via WhatsApp
      </button>
      <p className="text-center text-xs text-muted">Opens WhatsApp with your details filled in. We usually reply the same working day.</p>
    </form>
  );
}
