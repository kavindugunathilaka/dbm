"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import type { BillState, DocType, InvoiceData, InvoiceLine, Issuer, PaymentMethod, ReceiptData } from "@/lib/bill/types";
import { amountToWords, formatLKR, parseAmount } from "@/lib/bill/words";

const STORAGE_KEY = "dbm-bill-v1";
const METHODS: PaymentMethod[] = ["Cheque", "Cash", "Bank Transfer", "Online Payment"];

const today = () => new Date().toISOString().slice(0, 10);
const yymmdd = () => today().slice(2).replace(/-/g, "");

const defaultReceipt = (): ReceiptData => ({
  number: `RCT-${yymmdd()}-01`,
  date: today(),
  receivedFrom: "",
  project: "",
  invoiceRef: "",
  paymentFor: "",
  amount: "",
  amountWords: "",
  method: "Cheque",
  chequeNo: "",
  chequeBank: "",
  chequeDate: "",
  invoiceTotal: "",
  previouslyPaid: "",
  notes: "",
});

const STAGES = ["Stage 1 - Engagement Fee", "Stage 2 - Schematic Design", "Stage 3 - Design Development", "Stage 4 - Development Approval", "Stage 5 - Working Drawings", "Stage 6 - Landscape Design"];
const defaultInvoice = (): InvoiceData => ({
  number: `SIG-${yymmdd()}-01`,
  date: today(),
  project: "",
  client: "",
  architect: "DBM Associates (Pvt) Ltd.",
  feeLabel: "Architectural Consultancy (Consortium) Fee",
  lines: STAGES.map((description) => ({ description, estimate: "TBC", progress: "" })),
  previousCertificate: "",
  amountWords: "",
});

const defaultIssuer = (): Issuer => ({
  signatoryName: "DBM",
  signatoryTitle: "Director Operation",
  accountName: "",
  accountNo: "",
  bankBranch: "",
});

const initialState = (): BillState => ({ type: "receipt", receipt: defaultReceipt(), invoice: defaultInvoice(), issuer: defaultIssuer() });

function bumpNumber(n: string): string {
  const m = n.match(/^(.*?)(\d+)$/);
  if (!m) return n;
  return m[1] + String(Number(m[2]) + 1).padStart(m[2].length, "0");
}

export function BillGenerator() {
  const [state, setState] = useState<BillState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [signature, setSignature] = useState<{ bytes: ArrayBuffer; type: string; name: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  // Restore draft (per-browser only; nothing leaves this device).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<BillState>;
        setState((s) => ({
          type: saved.type ?? s.type,
          receipt: { ...s.receipt, ...saved.receipt },
          invoice: { ...s.invoice, ...saved.invoice },
          issuer: { ...s.issuer, ...saved.issuer },
        }));
      }
    } catch {
      /* storage unavailable */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, loaded]);

  const render = useCallback(async () => {
    const { buildBillPdf } = await import("@/lib/bill/pdf");
    return buildBillPdf(state, signature);
  }, [state, signature]);

  // Live preview (desktop), debounced.
  useEffect(() => {
    if (!loaded) return;
    if (typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches) return;
    const t = setTimeout(async () => {
      try {
        const { bytes, lossy } = await render();
        const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;
        setPreviewUrl(url);
        setNotice(lossy ? "Some characters (e.g. Sinhala) can't be printed in the PDF and were replaced with “?”. Please use English for PDF fields." : null);
      } catch (e) {
        setNotice(`Preview failed: ${(e as Error).message}`);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [render, loaded]);

  useEffect(() => () => void (urlRef.current && URL.revokeObjectURL(urlRef.current)), []);

  const fileName = useMemo(() => {
    const isR = state.type === "receipt";
    const num = (isR ? state.receipt.number : state.invoice.number) || "draft";
    const who = (isR ? state.receipt.receivedFrom : state.invoice.client).replace(/[^\w]+/g, "_").replace(/^_|_$/g, "");
    return `${isR ? "Receipt" : "Invoice"}_${num}${who ? `_${who}` : ""}.pdf`;
  }, [state]);

  async function output(mode: "download" | "open") {
    const problems = validate(state);
    if (problems.length) {
      setNotice(problems.join(" "));
      return;
    }
    setBusy(true);
    try {
      const { bytes, lossy } = await render();
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      if (mode === "open") window.open(url, "_blank", "noopener");
      else {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setNotice(lossy ? "Downloaded, but some non-English characters were replaced with “?”." : null);
    } catch (e) {
      setNotice(`Could not create PDF: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  const setType = (type: DocType) => setState((s) => ({ ...s, type }));
  const setR = <K extends keyof ReceiptData>(k: K, v: ReceiptData[K]) => setState((s) => ({ ...s, receipt: { ...s.receipt, [k]: v } }));
  const setI = <K extends keyof InvoiceData>(k: K, v: InvoiceData[K]) => setState((s) => ({ ...s, invoice: { ...s.invoice, [k]: v } }));
  const setIs = <K extends keyof Issuer>(k: K, v: Issuer[K]) => setState((s) => ({ ...s, issuer: { ...s.issuer, [k]: v } }));
  const setLine = (i: number, k: keyof InvoiceLine, v: string) =>
    setState((s) => ({ ...s, invoice: { ...s.invoice, lines: s.invoice.lines.map((l, j) => (j === i ? { ...l, [k]: v } : l)) } }));

  function fillReceiptFromInvoice() {
    const inv = state.invoice;
    const due =
      inv.lines.reduce((sum, l) => sum + (Number.isNaN(parseAmount(l.progress)) ? 0 : parseAmount(l.progress)), 0) -
      (Number.isNaN(parseAmount(inv.previousCertificate)) ? 0 : parseAmount(inv.previousCertificate));
    const paidLines = inv.lines.filter((l) => !Number.isNaN(parseAmount(l.progress)) && parseAmount(l.progress) > 0).map((l) => l.description);
    setState((s) => ({
      ...s,
      type: "receipt",
      receipt: {
        ...s.receipt,
        receivedFrom: inv.client,
        project: inv.project,
        invoiceRef: inv.number,
        paymentFor: paidLines.join(", ") || s.receipt.paymentFor,
        amount: due > 0 ? String(due) : s.receipt.amount,
        invoiceTotal: due > 0 ? String(due) : s.receipt.invoiceTotal,
        amountWords: "",
      },
    }));
    setNotice("Receipt filled from the invoice. Check the amount actually received.");
  }

  function newDocument() {
    if (!confirm(`Start a new ${state.type}? Current details will be cleared (issuer & bank details are kept).`)) return;
    setState((s) =>
      s.type === "receipt"
        ? { ...s, receipt: { ...defaultReceipt(), number: bumpNumber(s.receipt.number) } }
        : { ...s, invoice: { ...defaultInvoice(), number: bumpNumber(s.invoice.number) } },
    );
    setNotice(null);
  }

  async function onSignature(file: File | undefined) {
    if (!file) return setSignature(null);
    if (!["image/png", "image/jpeg"].includes(file.type)) return setNotice("Signature must be a PNG or JPG image.");
    if (file.size > 2 * 1024 * 1024) return setNotice("Signature image must be under 2 MB.");
    setSignature({ bytes: await file.arrayBuffer(), type: file.type, name: file.name });
  }

  const r = state.receipt;
  const inv = state.invoice;
  const rAmount = parseAmount(r.amount);
  const invDue =
    inv.lines.reduce((s, l) => s + (Number.isNaN(parseAmount(l.progress)) ? 0 : parseAmount(l.progress)), 0) -
    (Number.isNaN(parseAmount(inv.previousCertificate)) ? 0 : parseAmount(inv.previousCertificate));

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line bg-white">
        <div className="container-x flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Back to dbm.lk">
            <Logo className="h-6 w-auto" />
            <span className="text-sm font-bold text-muted">Bill Generator</span>
          </Link>
          <span className="hidden text-xs text-muted sm:block">Private tool · data stays in this browser</span>
        </div>
      </header>

      <div className="container-x grid gap-8 py-6 pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-10 lg:pb-10">
        {/* ------------------------------------------------ form */}
        <div className="space-y-6">
          <div role="tablist" aria-label="Document type" className="grid grid-cols-2 rounded-full border border-line bg-white p-1">
            {(["receipt", "invoice"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={state.type === t}
                onClick={() => setType(t)}
                className={`min-h-11 rounded-full text-sm font-bold capitalize transition-colors ${state.type === t ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
              >
                {t === "receipt" ? "Payment Receipt" : "Invoice"}
              </button>
            ))}
          </div>

          {state.type === "receipt" ? (
            <>
              <Section title="Receipt details" action={<button onClick={fillReceiptFromInvoice} className="text-sm font-bold text-brand-dark underline underline-offset-4">Fill from Invoice tab</button>}>
                <Grid>
                  <Field label="Receipt No." value={r.number} onChange={(v) => setR("number", v)} />
                  <Field label="Date" type="date" value={r.date} onChange={(v) => setR("date", v)} />
                </Grid>
                <Field label="Received from (client)" value={r.receivedFrom} onChange={(v) => setR("receivedFrom", v)} placeholder="e.g. Dr. A. Perera" required />
                <Field label="Project" value={r.project} onChange={(v) => setR("project", v)} placeholder="e.g. Proposed Warehouse and Office Facility at Pannala" />
                <Grid>
                  <Field label="Against invoice No." value={r.invoiceRef} onChange={(v) => setR("invoiceRef", v)} placeholder="SIG-261101-01" />
                  <Field label="Being payment for" value={r.paymentFor} onChange={(v) => setR("paymentFor", v)} placeholder="Stage 1 - Engagement Fee" />
                </Grid>
              </Section>

              <Section title="Payment">
                <Field
                  label="Amount received (Rs)"
                  inputMode="decimal"
                  value={r.amount}
                  onChange={(v) => setR("amount", v)}
                  placeholder="500000"
                  required
                  error={r.amount && Number.isNaN(rAmount) ? "Numbers only, e.g. 500000 or 500,000.00" : undefined}
                  hint={!Number.isNaN(rAmount) ? `Rs. ${formatLKR(rAmount)}` : undefined}
                />
                <Field
                  label="Amount in words"
                  value={r.amountWords}
                  onChange={(v) => setR("amountWords", v)}
                  placeholder={Number.isNaN(rAmount) ? "Filled automatically" : amountToWords(rAmount)}
                  hint="Leave empty to use the automatic wording."
                />
                <label className="block text-sm font-bold">
                  Payment method
                  <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {METHODS.map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setR("method", m)}
                        aria-pressed={r.method === m}
                        className={`min-h-11 rounded-xl border px-2 text-sm font-semibold ${r.method === m ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </label>
                {r.method === "Cheque" && (
                  <Grid cols={3}>
                    <Field label="Cheque No." value={r.chequeNo} onChange={(v) => setR("chequeNo", v)} inputMode="numeric" />
                    <Field label="Bank" value={r.chequeBank} onChange={(v) => setR("chequeBank", v)} placeholder="e.g. Sampath Bank" />
                    <Field label="Cheque date" type="date" value={r.chequeDate} onChange={(v) => setR("chequeDate", v)} />
                  </Grid>
                )}
                <Grid>
                  <Field label="Invoice total (optional)" inputMode="decimal" value={r.invoiceTotal} onChange={(v) => setR("invoiceTotal", v)} hint="Shows a balance-due summary." />
                  <Field label="Previously received (optional)" inputMode="decimal" value={r.previouslyPaid} onChange={(v) => setR("previouslyPaid", v)} />
                </Grid>
                <Field label="Notes (optional)" value={r.notes} onChange={(v) => setR("notes", v)} />
              </Section>
            </>
          ) : (
            <>
              <Section title="Invoice details">
                <Grid>
                  <Field label="Invoice reference" value={inv.number} onChange={(v) => setI("number", v)} />
                  <Field label="Date" type="date" value={inv.date} onChange={(v) => setI("date", v)} />
                </Grid>
                <Field label="Project" value={inv.project} onChange={(v) => setI("project", v)} required />
                <Field label="Client" value={inv.client} onChange={(v) => setI("client", v)} required />
                <Grid>
                  <Field label="Architect" value={inv.architect} onChange={(v) => setI("architect", v)} />
                  <Field label="Fee type" value={inv.feeLabel} onChange={(v) => setI("feeLabel", v)} />
                </Grid>
              </Section>

              <Section title="Items" action={<button onClick={() => setI("lines", [...inv.lines, { description: "", estimate: "", progress: "" }])} className="text-sm font-bold text-brand-dark underline underline-offset-4">+ Add line</button>}>
                <p className="-mt-2 text-xs text-muted">Amounts in Rs. Estimate can be a number or text such as “TBC”.</p>
                <ol className="space-y-3">
                  {inv.lines.map((l, i) => (
                    <li key={i} className="rounded-xl border border-line bg-paper p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted">Item {i + 1}</span>
                        <button
                          onClick={() => setI("lines", inv.lines.filter((_, j) => j !== i))}
                          className="min-h-8 px-2 text-xs font-bold text-brand-dark"
                          aria-label={`Remove item ${i + 1}`}
                        >
                          Remove
                        </button>
                      </div>
                      <Field label="Description" value={l.description} onChange={(v) => setLine(i, "description", v)} />
                      <Grid>
                        <Field label="Estimate" value={l.estimate} onChange={(v) => setLine(i, "estimate", v)} />
                        <Field label="Progress amount" inputMode="decimal" value={l.progress} onChange={(v) => setLine(i, "progress", v)} />
                      </Grid>
                    </li>
                  ))}
                </ol>
                <Field label="Less: previous certificate (Rs)" inputMode="decimal" value={inv.previousCertificate} onChange={(v) => setI("previousCertificate", v)} />
                <p className="rounded-xl bg-white p-4 text-sm">
                  Total amount due: <strong className="text-lg">Rs. {formatLKR(invDue)}</strong>
                  <br />
                  <span className="text-muted">{amountToWords(Math.max(invDue, 0))}</span>
                </p>
              </Section>
            </>
          )}

          <Section title="Signed by & bank details" collapsible>
            <Grid>
              <Field label="Signatory name" value={state.issuer.signatoryName} onChange={(v) => setIs("signatoryName", v)} />
              <Field label="Designation" value={state.issuer.signatoryTitle} onChange={(v) => setIs("signatoryTitle", v)} />
            </Grid>
            <label className="block text-sm font-bold">
              Signature image (optional, PNG/JPG)
              <input type="file" accept="image/png,image/jpeg" onChange={(e) => onSignature(e.target.files?.[0])} className="mt-1.5 block w-full text-sm file:mr-3 file:min-h-10 file:rounded-full file:border-0 file:bg-ink file:px-4 file:font-bold file:text-white" />
              <span className="mt-1 block text-xs font-normal text-muted">{signature ? `Using ${signature.name}. Not saved, so re-add it next time.` : "Or leave blank and sign the printed copy."}</span>
            </label>
            <p className="pt-2 text-xs font-bold uppercase tracking-wider text-muted">Bank details (printed on invoices)</p>
            <Field label="Account name" value={state.issuer.accountName} onChange={(v) => setIs("accountName", v)} />
            <Grid>
              <Field label="Account No." value={state.issuer.accountNo} onChange={(v) => setIs("accountNo", v)} inputMode="numeric" />
              <Field label="Bank & branch" value={state.issuer.bankBranch} onChange={(v) => setIs("bankBranch", v)} />
            </Grid>
          </Section>

          {notice && (
            <p role="status" className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand-dark">
              {notice}
            </p>
          )}

          <div className="hidden gap-3 lg:flex">
            <button onClick={() => output("download")} disabled={busy} className="btn-primary flex-1">
              {busy ? "Creating…" : "Download PDF"}
            </button>
            <button onClick={newDocument} className="btn-ghost">
              New {state.type}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------ preview (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Live preview · A4</p>
            <div className="aspect-[1/1.414] overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              {previewUrl ? (
                <iframe title="PDF preview" src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} className="h-full w-full" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">Preparing preview…</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------ mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex gap-2">
          <button onClick={() => output("open")} disabled={busy} className="btn-ghost flex-1 px-3!">
            Preview
          </button>
          <button onClick={() => output("download")} disabled={busy} className="btn-primary flex-[2] px-3!">
            {busy ? "Creating…" : "Download PDF"}
          </button>
        </div>
        <button onClick={newDocument} className="mt-2 w-full text-center text-xs font-bold text-muted">
          Start a new {state.type}
        </button>
      </div>
    </div>
  );
}

function validate(s: BillState): string[] {
  const out: string[] = [];
  if (s.type === "receipt") {
    if (!s.receipt.receivedFrom.trim()) out.push("Enter who the payment was received from.");
    const a = parseAmount(s.receipt.amount);
    if (Number.isNaN(a) || a <= 0) out.push("Enter a valid amount received.");
  } else {
    if (!s.invoice.client.trim()) out.push("Enter the client name.");
    if (!s.invoice.project.trim()) out.push("Enter the project.");
  }
  return out;
}

// ---------------------------------------------------------------- tiny form kit

function Section({ title, action, collapsible, children }: { title: string; action?: React.ReactNode; collapsible?: boolean; children: React.ReactNode }) {
  if (collapsible)
    return (
      <details className="card space-y-4 p-5!">
        <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between text-base font-extrabold [&::-webkit-details-marker]:hidden">
          {title}
          <span className="text-sm font-bold text-muted">Edit</span>
        </summary>
        <div className="mt-4 space-y-4">{children}</div>
      </details>
    );
  return (
    <section className="card space-y-4 p-5!">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-extrabold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return <div className={`grid gap-4 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  inputMode,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  error?: string;
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      {required && <span className="text-brand-dark"> *</span>}
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-base font-normal text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none ${error ? "border-brand" : "border-line"}`}
      />
      {(error || hint) && <span className={`mt-1 block text-xs font-normal ${error ? "text-brand-dark" : "text-muted"}`}>{error ?? hint}</span>}
    </label>
  );
}
