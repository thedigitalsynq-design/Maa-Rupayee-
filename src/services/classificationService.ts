import { ClassifiedResult, IndianState } from '../types';
import { findBestGSTMatch, GST_DATABASE } from '../data/gstDatabase';
import { getHistoricalRateForDate } from '../data/historicalRates';
import { GST_COUNCIL_UPDATES } from '../data/gstCouncilUpdates';
import { parseIndianAmount } from '../utils/indianCurrency';
import { calculateGST } from '../utils/gstCalculator';

export async function classifyProductOrService(
  rawInput: string,
  supplierState: IndianState,
  customerState: IndianState,
  transactionDate: string
): Promise<ClassifiedResult> {
  const trimmed = rawInput.trim();
  const { amount: detectedPrice, cleanQuery } = parseIndianAmount(trimmed);

  const isInclusive = /inclusive|including gst|incl\.?\s*gst|all incl/i.test(trimmed);

  // Try Server-side Gemini intelligence first
  try {
    const response = await fetch('/api/gst/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: trimmed,
        transactionDate: transactionDate || new Date().toISOString().split('T')[0],
      }),
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.success && resData.data) {
        const aiData = resData.data;
        const priceToUse = detectedPrice ?? aiData.extractedPrice ?? 50000;
        let finalRate = aiData.gstRate;

        // Check if there is a historical rate override for this date
        const histCheck = getHistoricalRateForDate(aiData.product || trimmed, transactionDate, finalRate);
        if (histCheck.isHistoricalOverride) {
          finalRate = histCheck.rate;
        }

        // Check GST council updates for notification alert
        const councilNote = checkCouncilUpdates(aiData.hsnSac, aiData.product || trimmed);

        const breakdown = calculateGST({
          amount: priceToUse,
          isInclusive: isInclusive || aiData.isInclusivePrice || false,
          gstRate: finalRate,
          cessRate: aiData.cessRate || 0,
          supplierState,
          customerState,
        });

        return {
          rawInput: trimmed,
          product: aiData.product || cleanQuery || 'Custom Item',
          category: aiData.category || 'General Indian Goods & Services',
          hsnSac: aiData.hsnSac || '9999',
          type: aiData.type || 'GOODS',
          gstRate: finalRate,
          cessRate: aiData.cessRate || 0,
          confidence: aiData.confidence || 'High',
          dataStatus: aiData.dataStatus || 'Officially Verified',
          extractedPrice: priceToUse,
          isInclusivePrice: isInclusive || aiData.isInclusivePrice || false,
          applicableConditions: histCheck.note || aiData.applicableConditions,
          sourceCitation: aiData.sourceCitation || 'CBIC Tariff Schedule',
          lastVerified: 'September 2024 (54th GST Council)',
          ambiguityQuestions: aiData.ambiguityQuestions || [],
          councilUpdateNote: councilNote,
          breakdown,
        };
      }
    }
  } catch {
    // Network or server error, proceed to offline database
  }

  // Fallback to offline rule-based knowledge engine
  return classifyOffline(trimmed, cleanQuery, detectedPrice, isInclusive, supplierState, customerState, transactionDate);
}

export function classifyOffline(
  rawInput: string,
  cleanQuery: string,
  detectedPrice: number | null,
  isInclusive: boolean,
  supplierState: IndianState,
  customerState: IndianState,
  transactionDate: string
): ClassifiedResult {
  const match = findBestGSTMatch(rawInput);

  const priceToUse = detectedPrice ?? 50000;
  let finalRate = match ? match.gstRate : 18;
  const cessRate = match ? match.cessRate || 0 : 0;

  // Check historical rate
  const histCheck = getHistoricalRateForDate(rawInput, transactionDate, finalRate);
  if (histCheck.isHistoricalOverride) {
    finalRate = histCheck.rate;
  }

  const councilNote = match ? checkCouncilUpdates(match.code, match.keywords.join(' ')) : undefined;

  const breakdown = calculateGST({
    amount: priceToUse,
    isInclusive,
    gstRate: finalRate,
    cessRate,
    supplierState,
    customerState,
  });

  if (match) {
    return {
      rawInput,
      product: cleanQuery || match.description.split(',')[0],
      category: match.category,
      hsnSac: match.code,
      type: match.type,
      gstRate: finalRate,
      cessRate,
      confidence: match.ambiguityQuestions && match.ambiguityQuestions.length > 0 ? 'Ambiguous' : 'High',
      dataStatus: 'Officially Verified',
      extractedPrice: priceToUse,
      isInclusivePrice: isInclusive,
      applicableConditions: histCheck.note || match.applicableConditions,
      sourceCitation: match.source,
      lastVerified: match.lastVerified,
      ambiguityQuestions: match.ambiguityQuestions,
      councilUpdateNote: councilNote,
      breakdown,
    };
  }

  // Generic fallback if not matched
  return {
    rawInput,
    product: cleanQuery || 'Commercial Goods / Services',
    category: 'General Trade & Commerce',
    hsnSac: '998399',
    type: 'SERVICES',
    gstRate: 18,
    cessRate: 0,
    confidence: 'Medium',
    dataStatus: 'Indicative',
    extractedPrice: priceToUse,
    isInclusivePrice: isInclusive,
    applicableConditions: 'Standard residual 18% rate applies under Schedule III where specific tariff entry is not explicitly classified.',
    sourceCitation: 'CBIC Schedule III - Residual Entry / SAC 9983',
    lastVerified: 'September 2024',
    councilUpdateNote: undefined,
    breakdown,
  };
}

function checkCouncilUpdates(hsnCode: string, keyword: string): string | undefined {
  const kwLower = keyword.toLowerCase();
  const update = GST_COUNCIL_UPDATES.find(u => 
    u.hsnSac.includes(hsnCode) || 
    kwLower.includes(u.productName.toLowerCase()) || 
    u.productName.toLowerCase().includes(kwLower)
  );

  if (update && update.status === 'Recommended') {
    return `GST Council Announcement: ${update.meeting} recommended rate change to ${update.newRate} (${update.title}). Status: ${update.status} - Not legally effective yet. Calculations currently apply statutory ${update.oldRate} rate.`;
  }
  return undefined;
}
