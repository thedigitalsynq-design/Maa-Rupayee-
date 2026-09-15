/**
 * Formats a number to Indian numbering format:
 * ₹1,000
 * ₹10,000
 * ₹1,00,000 (1 Lakh)
 * ₹10,00,000 (10 Lakh)
 * ₹1,00,00,000 (1 Crore)
 */
export function formatIndianCurrency(amount: number, includeSymbol = true, decimalPlaces = 2): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return includeSymbol ? '₹0.00' : '0.00';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const fixedStr = absAmount.toFixed(decimalPlaces);
  const [integerPart, decimalPart] = fixedStr.split('.');

  // Format integer part with Indian grouping:
  // Last 3 digits together, then every 2 digits separated by commas
  let result = '';
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherDigits = integerPart.substring(0, integerPart.length - 3);
    const withCommas = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = withCommas + ',' + lastThree;
  } else {
    result = integerPart;
  }

  const formatted = decimalPlaces > 0 ? `${result}.${decimalPart}` : result;
  const sign = isNegative ? '-' : '';
  return includeSymbol ? `${sign}₹${formatted}` : `${sign}${formatted}`;
}

/**
 * Parses user input for Indian monetary expressions:
 * "1 lakh", "2.5 lakhs", "10 lakh", "1 crore", "50k", "50,000", "₹65,000"
 */
export function parseIndianAmount(text: string): { amount: number | null; cleanQuery: string } {
  if (!text) return { amount: null, cleanQuery: text };

  let clean = text.trim();

  // Check for crore
  const croreMatch = clean.match(/(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(?:cr|crore|crores)\b/i);
  if (croreMatch) {
    const val = parseFloat(croreMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) {
      const remaining = clean.replace(croreMatch[0], '').trim();
      return { amount: val * 10000000, cleanQuery: remaining };
    }
  }

  // Check for lakh
  const lakhMatch = clean.match(/(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(?:lakh|lakhs|lac|lacs)\b/i);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) {
      const remaining = clean.replace(lakhMatch[0], '').trim();
      return { amount: val * 100000, cleanQuery: remaining };
    }
  }

  // Check for k (thousands)
  const kMatch = clean.match(/(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*k\b/i);
  if (kMatch) {
    const val = parseFloat(kMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) {
      const remaining = clean.replace(kMatch[0], '').trim();
      return { amount: val * 1000, cleanQuery: remaining };
    }
  }

  // Check for explicit currency symbol or plain number with comma or just number
  // e.g. "₹65,000" or "Rs 2500" or "65000" or "5000"
  const rupeeMatch = clean.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i);
  if (rupeeMatch) {
    const val = parseFloat(rupeeMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) {
      const remaining = clean.replace(rupeeMatch[0], '').trim();
      return { amount: val, cleanQuery: remaining };
    }
  }

  // Check for trailing or stand-alone numeric amount (e.g., "cotton saree 5000")
  const trailingNum = clean.match(/\b(\d{2,9}(?:\.\d+)?)\b$/);
  if (trailingNum) {
    const val = parseFloat(trailingNum[1]);
    if (!isNaN(val) && val > 10) { // avoid matching small specs like 55 inch or 256gb
      // Check if preceded by dimension like "inch" or "gb"
      const prefix = clean.substring(0, clean.lastIndexOf(trailingNum[1])).trim();
      if (!/(?:inch|gb|tb|cm|mm|kg|gm|ml|ltr|watt|w|v|hp|sqft)$/i.test(prefix)) {
        const remaining = clean.substring(0, clean.lastIndexOf(trailingNum[1])).trim();
        return { amount: val, cleanQuery: remaining };
      }
    }
  }

  return { amount: null, cleanQuery: clean };
}

/**
 * Converts Indian amount into words (e.g. Rupees Sixty-Five Thousand Only)
 */
export function amountInIndianWords(num: number): string {
  if (isNaN(num) || num === 0) return 'Rupees Zero Only';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + Math.floor(Math.abs(num))).substr(-9);
  const match = n.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!match) return 'Rupees ' + formatIndianCurrency(num);

  let str = '';
  // Crores
  str += (Number(match[1]) !== 0) ? (a[Number(match[1])] || b[match[1][0] as unknown as number] + ' ' + a[match[1][1] as unknown as number]) + 'Crore ' : '';
  // Lakhs
  str += (Number(match[2]) !== 0) ? (a[Number(match[2])] || b[match[2][0] as unknown as number] + ' ' + a[match[2][1] as unknown as number]) + 'Lakh ' : '';
  // Thousands
  str += (Number(match[3]) !== 0) ? (a[Number(match[3])] || b[match[3][0] as unknown as number] + ' ' + a[match[3][1] as unknown as number]) + 'Thousand ' : '';
  // Hundreds
  str += (Number(match[4]) !== 0) ? (a[Number(match[4])] || b[match[4][0] as unknown as number] + ' ' + a[match[4][1] as unknown as number]) + 'Hundred ' : '';
  // Tens and units
  str += (Number(match[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(match[5])] || b[match[5][0] as unknown as number] + ' ' + a[match[5][1] as unknown as number]) : '';

  // Paise
  const paise = Math.round((Math.abs(num) - Math.floor(Math.abs(num))) * 100);
  let paiseStr = '';
  if (paise > 0) {
    paiseStr = ' and ' + (a[paise] || b[Math.floor(paise / 10)] + ' ' + a[paise % 10]) + 'Paise';
  }

  return 'Rupees ' + str.trim() + paiseStr + ' Only';
}
