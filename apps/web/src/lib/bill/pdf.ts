// Client-side A4 PDF generation for DBM receipts and invoices (pdf-lib, no server).
import { PDFDocument, PDFFont, PDFImage, PDFPage, StandardFonts, rgb, type RGB } from "pdf-lib";
import { LOGO } from "../logo";
import { consultancyFee } from "./fee";
import { site } from "../site";
import type { BillState, InvoiceData, Issuer, ReceiptData } from "./types";
import { amountToWords, formatLKR, parseAmount } from "./words";

const W = 595.28;
const H = 841.89;
const M = 50;

const C = {
  ink: rgb(0.078, 0.078, 0.078),
  muted: rgb(0.36, 0.36, 0.35),
  line: rgb(0.86, 0.85, 0.82),
  brand: rgb(0.882, 0.145, 0.106),
  panel: rgb(0.953, 0.949, 0.933),
  white: rgb(1, 1, 1),
  logoInk: rgb(0, 0, 0),
  logoRed: rgb(1, 0, 0),
};

type Fonts = { reg: PDFFont; bold: PDFFont; ital: PDFFont };
type Ctx = { page: PDFPage; f: Fonts; lossy: boolean };

// Standard PDF fonts only cover Latin-1 (WinAnsi). Replace anything else and flag it.
const EXTRA = new Set("–—‘’“”•…€™".split(""));
function safe(ctx: Ctx, s: string): string {
  let out = "";
  for (const ch of s.replace(/\r/g, "")) {
    const code = ch.codePointAt(0)!;
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || EXTRA.has(ch)) out += ch;
    else if (ch === "\n" || ch === "\t") out += " ";
    else {
      out += "?";
      ctx.lossy = true;
    }
  }
  return out;
}

type TextOpts = { font?: PDFFont; size?: number; color?: RGB; align?: "left" | "right" | "center" };
function text(ctx: Ctx, raw: string, x: number, y: number, o: TextOpts = {}) {
  const font = o.font ?? ctx.f.reg;
  const size = o.size ?? 10;
  const s = safe(ctx, raw);
  const w = font.widthOfTextAtSize(s, size);
  const dx = o.align === "right" ? -w : o.align === "center" ? -w / 2 : 0;
  ctx.page.drawText(s, { x: x + dx, y, size, font, color: o.color ?? C.ink });
}

function wrap(ctx: Ctx, raw: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = safe(ctx, raw).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) <= maxW || !cur) cur = next;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

// Draws `raw` spread evenly between x1 and x2 (letter-spaced to match the logo width).
function trackedFit(ctx: Ctx, raw: string, x1: number, x2: number, y: number, font: PDFFont, color: RGB, maxSize: number) {
  const chars = [...safe(ctx, raw)];
  const target = x2 - x1;
  let size = maxSize;
  while (size > 5 && font.widthOfTextAtSize(chars.join(""), size) + (chars.length - 1) * 0.6 > target) size -= 0.25;
  const natural = font.widthOfTextAtSize(chars.join(""), size);
  const gap = chars.length > 1 ? Math.max(0, (target - natural) / (chars.length - 1)) : 0;
  let x = x1;
  for (const ch of chars) {
    ctx.page.drawText(ch, { x, y, size, font, color });
    x += font.widthOfTextAtSize(ch, size) + gap;
  }
}

function hline(ctx: Ctx, x1: number, x2: number, y: number, color = C.line, thickness = 0.8) {
  ctx.page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });
}

function drawLogo(ctx: Ctx, x: number, yTop: number, width: number) {
  const s = width / LOGO.width;
  const base = { x: x - LOGO.x * s, y: yTop + LOGO.y * s, scale: s, borderWidth: LOGO.stroke };
  ctx.page.drawSvgPath(LOGO.d, { ...base, borderColor: C.logoInk });
  ctx.page.drawSvgPath(LOGO.b, { ...base, borderColor: C.logoInk });
  ctx.page.drawSvgPath(LOGO.m, { ...base, borderColor: C.logoRed });
}

function drawHeader(ctx: Ctx, title: string, meta: [string, string][]): number {
  const { page, f } = ctx;
  page.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: C.brand });

  const y0 = H - 52;
  text(ctx, site.legalName, M, y0, { font: f.bold, size: 12 });
  text(ctx, `${site.address.street}, ${site.address.locality}.`, M, y0 - 15, { size: 9, color: C.muted });
  text(ctx, `Phone: ${site.phones.map((p) => p.display).join(" / ")}`, M, y0 - 28, { size: 9, color: C.muted });
  text(ctx, `Reg. No. ${site.regNo}`, M, y0 - 41, { size: 9, color: C.muted });

  const lw = 100;
  drawLogo(ctx, W - M - lw, y0 + 12, lw);
  trackedFit(ctx, site.printTagline, W - M - lw, W - M, y0 - 27, f.bold, C.muted, 7.5);

  hline(ctx, M, W - M, y0 - 58);

  const ty = y0 - 98;
  text(ctx, title, M, ty, { font: f.bold, size: 22 });
  page.drawRectangle({ x: M, y: ty - 12, width: 32, height: 3, color: C.brand });

  let my = ty + 14;
  for (const [k, v] of meta) {
    if (!v) continue;
    text(ctx, k, W - M - 175, my, { size: 8.5, color: C.muted });
    text(ctx, v, W - M, my, { size: 10, font: f.bold, align: "right" });
    my -= 15;
  }
  return Math.min(ty - 40, my - 18);
}

function drawFooter(ctx: Ctx) {
  hline(ctx, M, W - M, 58);
  text(
    ctx,
    `${site.legalName}  ·  ${site.address.street}, ${site.address.locality}  ·  ${site.phones[0].display}  ·  dbm.lk`,
    W / 2,
    44,
    { size: 7.5, color: C.muted, align: "center" },
  );
  ctx.page.drawRectangle({ x: 0, y: 0, width: W, height: 4, color: C.brand });
}

function drawSignature(ctx: Ctx, issuer: Issuer, sig: PDFImage | null, x: number, baseY: number) {
  const w = 175;
  if (sig) {
    const scale = Math.min(140 / sig.width, 48 / sig.height);
    ctx.page.drawImage(sig, { x: x + 4, y: baseY + 4, width: sig.width * scale, height: sig.height * scale });
  }
  hline(ctx, x, x + w, baseY, C.ink, 0.8);
  text(ctx, issuer.signatoryName || " ", x, baseY - 14, { font: ctx.f.bold, size: 10 });
  text(ctx, issuer.signatoryTitle || " ", x, baseY - 27, { size: 9, color: C.muted });
  text(ctx, `For and on behalf of ${site.legalName}`, x, baseY - 40, { size: 7.5, color: C.muted });
}

function drawSeal(ctx: Ctx, cx: number, cy: number) {
  ctx.page.drawCircle({ x: cx, y: cy, size: 36, borderColor: C.line, borderWidth: 1, borderDashArray: [3, 3] });
  text(ctx, "Company Seal", cx, cy - 3, { size: 7, color: C.muted, align: "center" });
}

function displayDate(iso: string): string {
  return iso || "";
}

function money(raw: string): string {
  const n = parseAmount(raw);
  return Number.isNaN(n) ? raw.trim() : formatLKR(n);
}

// ---------------------------------------------------------------- receipt

function drawReceipt(ctx: Ctx, r: ReceiptData, issuer: Issuer, sig: PDFImage | null) {
  const { f, page } = ctx;
  let y = drawHeader(ctx, "PAYMENT RECEIPT", [
    ["Receipt No.", r.number],
    ["Date", displayDate(r.date)],
    ["Invoice Ref.", r.invoiceRef],
  ]);

  text(ctx, "RECEIVED WITH THANKS FROM", M, y, { size: 8, font: f.bold, color: C.muted });
  y -= 22;
  for (const line of wrap(ctx, r.receivedFrom || " ", f.bold, 16, W - 2 * M)) {
    text(ctx, line, M, y, { font: f.bold, size: 16 });
    y -= 20;
  }
  y -= 14;

  // Amount panel
  const amount = parseAmount(r.amount);
  const words = r.amountWords || (Number.isNaN(amount) ? "" : amountToWords(amount));
  const wl = wrap(ctx, words, f.ital, 10, W - 2 * M - 36);
  const ph = 66 + wl.length * 13;
  page.drawRectangle({ x: M, y: y - ph, width: W - 2 * M, height: ph, color: C.panel });
  page.drawRectangle({ x: M, y: y - ph, width: 4, height: ph, color: C.brand });
  text(ctx, "AMOUNT RECEIVED", M + 20, y - 20, { size: 8, font: f.bold, color: C.muted });
  text(ctx, `Rs. ${Number.isNaN(amount) ? "0.00" : formatLKR(amount)}`, M + 20, y - 47, { size: 24, font: f.bold });
  wl.forEach((l, i) => text(ctx, l, M + 20, y - 66 - i * 13, { size: 10, font: f.ital, color: C.muted }));
  y -= ph + 18;

  // Detail rows
  const rows: [string, string][] = [
    ["Project", r.project],
    ["Being payment for", r.paymentFor],
    ["Against invoice", r.invoiceRef],
    ["Payment method", r.method],
  ];
  if (r.method === "Cheque") rows.push(["Cheque No.", r.chequeNo], ["Bank", r.chequeBank], ["Cheque date", displayDate(r.chequeDate)]);
  rows.push(["Notes", r.notes]);

  const vx = M + 140;
  for (const [k, v] of rows) {
    if (!v?.trim()) continue;
    const lines = wrap(ctx, v, f.reg, 10.5, W - M - vx);
    text(ctx, k, M, y - 14, { size: 9, color: C.muted });
    lines.forEach((l, i) => text(ctx, l, vx, y - 14 - i * 13, { size: 10.5 }));
    y -= 14 + (lines.length - 1) * 13 + 9;
    hline(ctx, M, W - M, y);
  }

  // Balance summary (only if invoice total given)
  const total = parseAmount(r.invoiceTotal);
  if (!Number.isNaN(total)) {
    const prev = parseAmount(r.previouslyPaid);
    const prevN = Number.isNaN(prev) ? 0 : prev;
    const thisN = Number.isNaN(amount) ? 0 : amount;
    const bal = total - prevN - thisN;
    y -= 18;
    const x1 = W - M - 250;
    const sum: [string, string, boolean][] = [
      ["Invoice amount", formatLKR(total), false],
      ["Previously received", formatLKR(prevN), false],
      ["This receipt", formatLKR(thisN), false],
      [bal < 0 ? "Overpaid" : "Balance due", formatLKR(Math.abs(bal)), true],
    ];
    for (const [k, v, strong] of sum) {
      if (strong) hline(ctx, x1, W - M, y + 4, C.ink, 0.8);
      text(ctx, k, x1, y - 9, { size: 9.5, color: strong ? C.ink : C.muted, font: strong ? f.bold : f.reg });
      text(ctx, `Rs. ${v}`, W - M, y - 9, { size: 10, font: strong ? f.bold : f.reg, align: "right" });
      y -= 18;
    }
  }

  if (r.method === "Cheque") {
    y -= 14;
    text(ctx, "This receipt is valid subject to realisation of the cheque.", M, y, { size: 8.5, font: f.ital, color: C.muted });
  }

  drawSignature(ctx, issuer, sig, M, 150);
  drawSeal(ctx, W - M - 60, 128);
  drawFooter(ctx);
}

// ---------------------------------------------------------------- invoice

function drawInvoice(ctx: Ctx, inv: InvoiceData, issuer: Issuer, sig: PDFImage | null) {
  const { f, page } = ctx;
  let y = drawHeader(ctx, "INVOICE", [
    ["Invoice Reference", inv.number],
    ["Date", displayDate(inv.date)],
  ]);

  const info: [string, string][] = [
    ["Project", inv.project],
    ["Client", inv.client],
    ["Architect", inv.architect],
  ];
  for (const [k, v] of info) {
    if (!v?.trim()) continue;
    const lines = wrap(ctx, v, f.reg, 10.5, W - 2 * M - 80);
    text(ctx, k, M, y, { size: 9, color: C.muted });
    lines.forEach((l, i) => text(ctx, l, M + 80, y - i * 13, { size: 10.5, font: k === "Project" ? f.bold : f.reg }));
    y -= 17 + (lines.length - 1) * 13;
  }

  // Consultancy fee line: "<label> : TBC" until the project amount is known.
  if (inv.feeLabel.trim()) {
    const label = `${safe(ctx, inv.feeLabel.trim())} :`;
    const lw = f.reg.widthOfTextAtSize(label, 9.5);
    text(ctx, label, M, y, { size: 9.5, color: C.muted });
    const fee = consultancyFee(inv);
    const fl = wrap(ctx, fee.text, f.bold, 10.5, W - 2 * M - lw - 6);
    fl.forEach((l, i) => text(ctx, l, M + lw + 6, y - i * 13, { size: 10.5, font: f.bold, color: fee.known ? C.ink : C.brand }));
    y -= 17 + (fl.length - 1) * 13;
  }
  y -= 10;

  // Table
  const cx = { item: M, desc: M + 38, est: W - M - 110, prog: W - M };
  const estR = W - M - 118; // right edge of estimate column
  page.drawRectangle({ x: M, y: y - 24, width: W - 2 * M, height: 24, color: C.ink });
  text(ctx, "ITEM", cx.item + 8, y - 15.5, { size: 8, font: f.bold, color: C.white });
  text(ctx, "DESCRIPTION", cx.desc + 8, y - 15.5, { size: 8, font: f.bold, color: C.white });
  text(ctx, "ESTIMATE (Rs)", estR, y - 15.5, { size: 8, font: f.bold, color: C.white, align: "right" });
  text(ctx, "PROGRESS (Rs)", cx.prog - 8, y - 15.5, { size: 8, font: f.bold, color: C.white, align: "right" });
  y -= 24;

  let estSum = 0;
  let progSum = 0;
  const lines = inv.lines.filter((l) => l.description.trim() || l.estimate.trim() || l.progress.trim());
  lines.forEach((l, i) => {
    const dl = wrap(ctx, l.description, f.reg, 10, estR - 120 - cx.desc - 8);
    const rh = 12 + dl.length * 13;
    text(ctx, `${i + 1}.`, cx.item + 8, y - 16, { size: 10, color: C.muted });
    dl.forEach((d, j) => text(ctx, d, cx.desc + 8, y - 16 - j * 13, { size: 10 }));
    text(ctx, money(l.estimate), estR, y - 16, { size: 10, align: "right" });
    text(ctx, money(l.progress), cx.prog - 8, y - 16, { size: 10, align: "right" });
    const e = parseAmount(l.estimate);
    const p = parseAmount(l.progress);
    if (!Number.isNaN(e)) estSum += e;
    if (!Number.isNaN(p)) progSum += p;
    y -= rh;
    hline(ctx, M, W - M, y);
  });

  // Totals
  const totalRow = (label: string, est: string, prog: string, bold = false) => {
    text(ctx, label, cx.desc + 8, y - 16, { size: 10, font: bold ? f.bold : f.reg });
    if (est) text(ctx, est, estR, y - 16, { size: 10, font: bold ? f.bold : f.reg, align: "right" });
    if (prog) text(ctx, prog, cx.prog - 8, y - 16, { size: 10, font: bold ? f.bold : f.reg, align: "right" });
    y -= 24;
  };
  totalRow("Total Amount", formatLKR(estSum), formatLKR(progSum), true);
  const prev = parseAmount(inv.previousCertificate);
  const prevN = Number.isNaN(prev) ? 0 : prev;
  if (prevN > 0) totalRow("Less: Previous Certificate", "", `(${formatLKR(prevN)})`);

  const due = progSum - prevN;
  y -= 4;
  page.drawRectangle({ x: M, y: y - 30, width: W - 2 * M, height: 30, color: C.panel });
  page.drawRectangle({ x: M, y: y - 30, width: 4, height: 30, color: C.brand });
  text(ctx, "TOTAL AMOUNT DUE", cx.desc + 8, y - 19, { size: 9.5, font: f.bold });
  text(ctx, `Rs. ${formatLKR(due)}`, cx.prog - 8, y - 20, { size: 13, font: f.bold, align: "right" });
  y -= 50;

  const words = inv.amountWords || amountToWords(due);
  const conf = `We hereby confirm that the due payment of this invoice is Rs. ${formatLKR(due)} (${words}).`;
  for (const l of wrap(ctx, conf, f.reg, 10, W - 2 * M)) {
    text(ctx, l, M, y, { size: 10 });
    y -= 14;
  }

  drawSignature(ctx, issuer, sig, M, 150);

  // Bank details
  const bx = W / 2 + 30;
  const bank: [string, string][] = [
    ["Account name", issuer.accountName],
    ["Account no.", issuer.accountNo],
    ["Bank / Branch", issuer.bankBranch],
  ];
  if (bank.some(([, v]) => v.trim())) {
    let by = 196;
    text(ctx, "PAYMENT DETAILS", bx, by, { size: 8, font: f.bold, color: C.muted });
    by -= 17;
    for (const [k, v] of bank) {
      if (!v.trim()) continue;
      text(ctx, k, bx, by, { size: 8.5, color: C.muted });
      text(ctx, v, bx + 72, by, { size: 9.5, font: k === "Account no." ? f.bold : f.reg });
      by -= 15;
    }
  }
  drawFooter(ctx);
}

// ---------------------------------------------------------------- entry

export async function buildBillPdf(state: BillState, signature?: { bytes: ArrayBuffer; type: string } | null) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([W, H]);
  const f: Fonts = {
    reg: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    ital: await doc.embedFont(StandardFonts.HelveticaOblique),
  };
  const ctx: Ctx = { page, f, lossy: false };

  let sig: PDFImage | null = null;
  if (signature) {
    sig = signature.type === "image/png" ? await doc.embedPng(signature.bytes) : await doc.embedJpg(signature.bytes);
  }

  const isReceipt = state.type === "receipt";
  const number = isReceipt ? state.receipt.number : state.invoice.number;
  doc.setTitle(`${isReceipt ? "Receipt" : "Invoice"} ${number}`);
  doc.setAuthor(site.legalName);
  doc.setCreator("dbm.lk bill generator");
  doc.setProducer("dbm.lk");

  if (isReceipt) drawReceipt(ctx, state.receipt, state.issuer, sig);
  else drawInvoice(ctx, state.invoice, state.issuer, sig);

  const bytes = await doc.save();
  return { bytes, lossy: ctx.lossy };
}
