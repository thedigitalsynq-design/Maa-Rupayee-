import { IndianState, TaxBreakdown, TransactionType } from '../types';
import { DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from '../data/indianStates';

export interface CalculationInput {
  amount: number;
  isInclusive: boolean;
  gstRate: number;
  cessRate?: number;
  supplierState?: IndianState;
  customerState?: IndianState;
}

export function calculateGST(input: CalculationInput): TaxBreakdown {
  const { amount, isInclusive, gstRate, cessRate = 0 } = input;
  const supplierState = input.supplierState || DEFAULT_SUPPLIER_STATE;
  const customerState = input.customerState || DEFAULT_CUSTOMER_STATE;

  const isIntraState = (supplierState?.code || '') === (customerState?.code || '');
  const isUTWithoutLeg = isIntraState && Boolean(supplierState?.isUT) && !supplierState?.hasLegislature;

  let transactionType: TransactionType;
  if (!isIntraState) {
    transactionType = 'Inter-State';
  } else if (isUTWithoutLeg) {
    transactionType = 'Intra-State (UTGST)';
  } else {
    transactionType = 'Intra-State';
  }

  const combinedTaxPercent = (gstRate + cessRate) / 100;

  let taxableValue: number;
  let totalGst: number;
  let cessAmount: number;
  let totalAmount: number;

  if (isInclusive) {
    // Reverse calculation: Taxable = Total / (1 + TaxRate)
    taxableValue = combinedTaxPercent > 0 ? amount / (1 + combinedTaxPercent) : amount;
    const totalTax = amount - taxableValue;
    
    // Proportional breakdown if cess exists
    if (combinedTaxPercent > 0) {
      const gstRatio = gstRate / (gstRate + cessRate);
      totalGst = totalTax * gstRatio;
      cessAmount = totalTax * (1 - gstRatio);
    } else {
      totalGst = 0;
      cessAmount = 0;
    }
    totalAmount = amount;
  } else {
    // Forward calculation: Taxable = Amount, GST = Taxable * Rate
    taxableValue = amount;
    totalGst = taxableValue * (gstRate / 100);
    cessAmount = taxableValue * (cessRate / 100);
    totalAmount = taxableValue + totalGst + cessAmount;
  }

  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;
  let utgstRate = 0;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let utgstAmount = 0;

  if (!isIntraState) {
    igstRate = gstRate;
    igstAmount = totalGst;
  } else if (isUTWithoutLeg) {
    cgstRate = gstRate / 2;
    utgstRate = gstRate / 2;
    cgstAmount = totalGst / 2;
    utgstAmount = totalGst / 2;
  } else {
    cgstRate = gstRate / 2;
    sgstRate = gstRate / 2;
    cgstAmount = totalGst / 2;
    sgstAmount = totalGst / 2;
  }

  return {
    taxableValue: Number(taxableValue.toFixed(2)),
    gstRate,
    cessRate,
    cgstRate,
    sgstRate,
    igstRate,
    utgstRate,
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstAmount: Number(sgstAmount.toFixed(2)),
    igstAmount: Number(igstAmount.toFixed(2)),
    utgstAmount: Number(utgstAmount.toFixed(2)),
    cessAmount: Number(cessAmount.toFixed(2)),
    totalGst: Number(totalGst.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    transactionType,
    isInclusive,
    supplierState,
    customerState,
  };
}
