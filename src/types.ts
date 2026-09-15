export type ClassificationConfidence = 'High' | 'Medium' | 'Ambiguous';

export type DataStatus = 'Officially Verified' | 'Indicative';

export type GSTCouncilStatus = 'Recommended' | 'Notified' | 'Effective';

export type TransactionType = 'Intra-State' | 'Inter-State' | 'Intra-State (UTGST)';

export interface IndianState {
  code: string; // 2-letter e.g. "KA"
  name: string; // e.g. "Karnataka"
  tin: string; // 2-digit GST state code e.g. "29"
  isUT: boolean;
  hasLegislature: boolean; // Delhi, Puducherry, J&K have legislatures
}

export interface AmbiguityOption {
  label: string;
  rate: number;
  hsn?: string;
  conditionNote?: string;
}

export interface AmbiguityQuestion {
  id: string;
  question: string;
  options: AmbiguityOption[];
  explanation?: string;
}

export interface GSTItem {
  code: string; // HSN or SAC
  type: 'GOODS' | 'SERVICES';
  category: string;
  subCategory?: string;
  description: string;
  keywords: string[];
  gstRate: number; // in percentage, e.g. 18
  cessRate?: number; // e.g. 12% for luxury cars
  applicableConditions?: string;
  source: string;
  lastVerified: string;
  isExempt?: boolean;
  historicalRates?: Array<{
    effectiveDate: string;
    rate: number;
    notificationNo: string;
    notes: string;
  }>;
  ambiguityQuestions?: AmbiguityQuestion[];
}

export interface TaxBreakdown {
  taxableValue: number;
  gstRate: number;
  cessRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  utgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  utgstAmount: number;
  cessAmount: number;
  totalGst: number;
  totalAmount: number;
  transactionType: TransactionType;
  isInclusive: boolean;
  supplierState: IndianState;
  customerState: IndianState;
}

export interface ClassifiedResult {
  rawInput: string;
  product: string;
  category: string;
  hsnSac: string;
  type: 'GOODS' | 'SERVICES';
  gstRate: number;
  cessRate?: number;
  confidence: ClassificationConfidence;
  dataStatus: DataStatus;
  extractedPrice: number;
  isInclusivePrice: boolean;
  quantity?: number;
  applicableConditions?: string;
  sourceCitation: string;
  lastVerified: string;
  ambiguityQuestions?: AmbiguityQuestion[];
  councilUpdateNote?: string;
  breakdown?: TaxBreakdown;
}

export interface GSTCouncilUpdate {
  id: string;
  meeting: string;
  title: string;
  category: string;
  hsnSac: string;
  productName: string;
  oldRate: string;
  newRate: string;
  status: GSTCouncilStatus;
  notificationNo?: string;
  notificationDate?: string;
  effectiveDate: string;
  impactSummary: string;
  appliedToCalculator: boolean;
  officialSource: string;
  details: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  hsnSac: string;
  type: 'GOODS' | 'SERVICES';
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  gstRate: number;
  cessRate: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  utgstAmount: number;
  cessAmount: number;
  totalAmount: number;
}

export interface SavedCalculation {
  id: string;
  timestamp: number;
  query: string;
  product: string;
  hsnSac: string;
  rate: number;
  taxableValue: number;
  gstAmount: number;
  finalAmount: number;
  supplierState: string;
  customerState: string;
  transactionType: TransactionType;
}
