// Amount → words in the style DBM already uses on invoices:
// 500000 → "Rupees Five Hundred Thousand Only"
// 1250.5 → "Rupees One Thousand Two Hundred Fifty and Cents Fifty Only"

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const SCALES: [number, string][] = [
  [1e9, "Billion"],
  [1e6, "Million"],
  [1e3, "Thousand"],
];

function below1000(n: number): string {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`);
    n %= 100;
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : ""));
  } else if (n > 0) {
    parts.push(ONES[n]);
  }
  return parts.join(" ");
}

export function integerToWords(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "";
  n = Math.floor(n);
  if (n === 0) return "Zero";
  const parts: string[] = [];
  for (const [value, name] of SCALES) {
    if (n >= value) {
      parts.push(`${integerToWords(Math.floor(n / value))} ${name}`);
      n %= value;
    }
  }
  if (n > 0) parts.push(below1000(n));
  return parts.join(" ");
}

export function amountToWords(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return "";
  const cents = Math.round(amount * 100);
  const rupees = Math.floor(cents / 100);
  const c = cents % 100;
  let s = `Rupees ${integerToWords(rupees)}`;
  if (c > 0) s += ` and Cents ${integerToWords(c)}`;
  return `${s} Only`;
}

export function formatLKR(n: number): string {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Parses "500,000.00", "Rs. 500000" etc. Returns NaN for blank/invalid. */
export function parseAmount(v: string): number {
  const cleaned = v.replace(/rs\.?/i, "").replace(/[,\s]/g, "");
  if (cleaned === "") return NaN;
  return /^\d+(\.\d{1,2})?$/.test(cleaned) ? Number(cleaned) : NaN;
}
