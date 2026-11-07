import type { InvoiceData } from "./types";
import { formatLKR, parseAmount } from "./words";

// Consultancy fee = project amount × fee %. Until the project amount is known, the fee is "TBC".
export function consultancyFee(inv: Pick<InvoiceData, "projectAmount" | "feePercent">) {
  const amount = parseAmount(inv.projectAmount);
  const pct = Number(inv.feePercent.replace("%", "").trim());
  if (Number.isNaN(amount) || amount <= 0 || !inv.feePercent.trim() || !Number.isFinite(pct) || pct <= 0) {
    return { known: false as const, text: "TBC" };
  }
  const fee = Math.round(amount * pct) / 100;
  const pctText = Number.isInteger(pct) ? String(pct) : String(Number(pct.toFixed(3)));
  return {
    known: true as const,
    fee,
    text: `Rs. ${formatLKR(fee)} (${pctText}% of project amount Rs. ${formatLKR(amount)})`,
  };
}
