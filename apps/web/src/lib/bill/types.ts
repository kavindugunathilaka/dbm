export type DocType = "receipt" | "invoice";

export type PaymentMethod = "Cheque" | "Cash" | "Bank Transfer" | "Online Payment";

export type Issuer = {
  signatoryName: string; // e.g. "DBM"
  signatoryTitle: string; // e.g. "Director Operation"
  accountName: string;
  accountNo: string;
  bankBranch: string;
};

export type ReceiptData = {
  number: string;
  date: string; // yyyy-mm-dd
  receivedFrom: string;
  project: string;
  invoiceRef: string;
  paymentFor: string;
  amount: string; // raw input, parsed on render
  amountWords: string; // auto unless edited
  method: PaymentMethod;
  chequeNo: string;
  chequeBank: string;
  chequeDate: string;
  invoiceTotal: string; // optional, for balance
  previouslyPaid: string; // optional
  notes: string;
};

export type InvoiceLine = { description: string; estimate: string; progress: string };

export type InvoiceData = {
  number: string;
  date: string;
  project: string;
  client: string;
  architect: string;
  feeLabel: string;
  projectAmount: string; // blank until known → fee shows "TBC"
  feePercent: string; // e.g. "5" for 5%
  lines: InvoiceLine[];
  previousCertificate: string;
  amountWords: string;
};

export type BillState = {
  type: DocType;
  receipt: ReceiptData;
  invoice: InvoiceData;
  issuer: Issuer;
};
