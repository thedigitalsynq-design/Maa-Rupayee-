export interface HistoricalRateRule {
  id: string;
  itemKeyword: string;
  hsnSac: string;
  description: string;
  ranges: Array<{
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD or 'current'
    rate: number;
    cessRate?: number;
    notificationRef: string;
    rationale: string;
  }>;
}

export const HISTORICAL_RULES: HistoricalRateRule[] = [
  {
    id: 'hist-footwear',
    itemKeyword: 'footwear',
    hsnSac: '6403',
    description: 'Footwear with retail price up to ₹1,000',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2021-12-31',
        rate: 5,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Concessional 5% rate for mass consumption footwear up to ₹1,000'
      },
      {
        startDate: '2022-01-01',
        endDate: 'current',
        rate: 12,
        notificationRef: 'Notification No. 14/2021-CT(Rate)',
        rationale: 'Inverted duty structure correction: unified to 12% across all footwear tiers'
      }
    ]
  },
  {
    id: 'hist-mobile',
    itemKeyword: 'mobile',
    hsnSac: '8517',
    description: 'Mobile phones and handsets',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2020-03-31',
        rate: 12,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Initial GST rollout rate on mobile phone handsets'
      },
      {
        startDate: '2020-04-01',
        endDate: 'current',
        rate: 18,
        notificationRef: 'Notification No. 03/2020-CT(Rate)',
        rationale: '39th GST Council recommendation: rate hiked from 12% to 18% to correct inverted duty structure'
      }
    ]
  },
  {
    id: 'hist-tv-32',
    itemKeyword: 'tv',
    hsnSac: '8528',
    description: 'Televisions up to 32 inches',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2018-12-31',
        rate: 28,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Initial 28% peak luxury rate for all TVs'
      },
      {
        startDate: '2019-01-01',
        endDate: 'current',
        rate: 18,
        notificationRef: 'Notification No. 24/2018-CT(Rate)',
        rationale: '31st GST Council decision: 28% to 18% reduction for TVs <= 32 inches'
      }
    ]
  },
  {
    id: 'hist-packaged-grains',
    itemKeyword: 'rice',
    hsnSac: '1006',
    description: 'Pre-packaged and labelled rice / pulses',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2022-07-17',
        rate: 0,
        notificationRef: 'Notification No. 02/2017-CT(Rate)',
        rationale: 'Exempt unless carrying registered actionable brand name'
      },
      {
        startDate: '2022-07-18',
        endDate: 'current',
        rate: 5,
        notificationRef: 'Notification No. 06/2022-CT(Rate)',
        rationale: '47th GST Council decision: 5% on all pre-packaged and labelled commodities <= 25kg'
      }
    ]
  },
  {
    id: 'hist-cancer-drugs',
    itemKeyword: 'cancer',
    hsnSac: '3004',
    description: 'Trastuzumab, Osimertinib, Durvalumab cancer medicines',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2024-10-09',
        rate: 12,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Standard pharmaceutical formulations rate of 12%'
      },
      {
        startDate: '2024-10-10',
        endDate: 'current',
        rate: 5,
        notificationRef: 'Notification No. 05/2024-CT(Rate)',
        rationale: '54th GST Council recommendation notified: slashed to 5% for patient relief'
      }
    ]
  },
  {
    id: 'hist-online-gaming',
    itemKeyword: 'gaming',
    hsnSac: '9996',
    description: 'Online real money gaming deposits',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2023-09-30',
        rate: 18,
        notificationRef: 'Notification No. 11/2017-CT(Rate)',
        rationale: '18% applied only on gross gaming platform service fee / rake'
      },
      {
        startDate: '2023-10-01',
        endDate: 'current',
        rate: 28,
        notificationRef: 'Notification No. 49/2023-CT',
        rationale: 'Statutory 28% GST on entire face value / deposit amount under CGST Amendment Act'
      }
    ]
  }
];

/**
 * Looks up historical rate for an item on a specific transaction date (YYYY-MM-DD)
 */
export function getHistoricalRateForDate(
  itemQuery: string,
  targetDate: string,
  currentDefaultRate: number
): { rate: number; note?: string; isHistoricalOverride: boolean } {
  if (!targetDate) return { rate: currentDefaultRate, isHistoricalOverride: false };

  const queryLower = itemQuery.toLowerCase();
  
  for (const rule of HISTORICAL_RULES) {
    if (queryLower.includes(rule.itemKeyword)) {
      for (const range of rule.ranges) {
        const isAfterStart = targetDate >= range.startDate;
        const isBeforeEnd = range.endDate === 'current' ? true : targetDate <= range.endDate;
        if (isAfterStart && isBeforeEnd) {
          const isCurrent = range.endDate === 'current';
          return {
            rate: range.rate,
            note: `${rule.description}: Applicable GST on ${targetDate} was ${range.rate}% as per ${range.notificationRef}. (${range.rationale})`,
            isHistoricalOverride: !isCurrent
          };
        }
      }
    }
  }

  return { rate: currentDefaultRate, isHistoricalOverride: false };
}
