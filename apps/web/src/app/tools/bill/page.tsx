import type { Metadata } from "next";
import { BillGenerator } from "@/components/bill/BillGenerator";

export const metadata: Metadata = {
  title: "Bill Generator",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
};

export default function BillPage() {
  return <BillGenerator />;
}
