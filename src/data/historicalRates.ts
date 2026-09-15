export interface HistoricalRateRule {
  id: string;
  itemKeyword: string;
  altKeywords?: string[];
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
    description: 'Footwear with retail price up to ₹2,500 (₹1,000 before 2022)',
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
        endDate: '2025-09-21',
        rate: 12,
        notificationRef: 'Notification No. 14/2021-CT(Rate)',
        rationale: 'Inverted duty structure correction: unified to 12% across all footwear tiers'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 5,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): footwear up to ₹2,500 moved to 5%; above ₹2,500 at 18%'
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
    id: 'hist-tv-big',
    itemKeyword: '55 inch',
    altKeywords: ['43 inch', '50 inch', '65 inch', '75 inch', 'above 32', 'large tv', 'big tv', 'oled tv', 'qled tv'],
    hsnSac: '8528',
    description: 'Large-screen televisions (above 32 inches)',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 28,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Large TVs taxed at the 28% peak luxury slab'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 18,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): all televisions unified at 18%'
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
    altKeywords: ['betting', 'casino', 'lottery', 'online money gaming', 'horse racing'],
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
        endDate: '2025-09-21',
        rate: 28,
        notificationRef: 'Notification No. 49/2023-CT',
        rationale: 'Statutory 28% GST on entire face value / deposit amount under CGST Amendment Act'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 40,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): specified actionable claims (betting, casinos, lottery, online money gaming, horse racing) moved to the 40% demerit slab'
      }
    ]
  },
  {
    id: 'hist-butter-ghee',
    itemKeyword: 'ghee',
    altKeywords: ['butter', 'cheese', 'makhan'],
    hsnSac: '0405',
    description: 'Butter, ghee and cheese',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 12,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Dairy fats taxed at 12% under HSN 0405/0406'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 5,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): butter, ghee and cheese moved to 5%'
      }
    ]
  },
  {
    id: 'hist-biscuits',
    itemKeyword: 'biscuit',
    altKeywords: ['cookies', 'bakery', 'cake', 'namkeen'],
    hsnSac: '1905',
    description: 'Biscuits and bakery wares',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 18,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Bakery wares taxed at the 18% standard slab'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 5,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): biscuits and bakery wares moved to 5%'
      }
    ]
  },
  {
    id: 'hist-medicines',
    itemKeyword: 'medicine',
    altKeywords: ['medicines', 'tablet', 'paracetamol', 'pharma'],
    hsnSac: '3004',
    description: 'General pharmaceutical formulations',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 12,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Standard formulations taxed at 12%'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 5,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): most medicines moved to 5%; 33 life-saving drugs exempted'
      }
    ]
  },
  {
    id: 'hist-ac',
    itemKeyword: 'air conditioner',
    altKeywords: ['split ac', 'window ac', 'inverter ac'],
    hsnSac: '8415',
    description: 'Air conditioners',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 28,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'ACs taxed at the 28% luxury slab'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 18,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): air conditioners moved to 18%'
      }
    ]
  },
  {
    id: 'hist-cement',
    itemKeyword: 'cement',
    hsnSac: '2523',
    description: 'Cement',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 28,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Cement taxed at the peak 28% slab'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 18,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): cement moved to 18%'
      }
    ]
  },
  {
    id: 'hist-hotel',
    itemKeyword: 'hotel',
    altKeywords: ['resort', 'room booking', 'guest house'],
    hsnSac: '996311',
    description: 'Hotel rooms up to ₹7,500 per day',
    ranges: [
      {
        startDate: '2019-09-01',
        endDate: '2025-09-21',
        rate: 12,
        notificationRef: 'Notification No. 20/2019-CT(Rate)',
        rationale: 'Mid-tier hotel rooms taxed at 12%'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 5,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): hotel rooms up to ₹7,500 moved to 5%'
      }
    ]
  },
  {
    id: 'hist-small-car',
    itemKeyword: 'small car',
    altKeywords: ['hatchback', 'creta', 'swift', 'baleno'],
    hsnSac: '8703',
    description: 'Small cars (petrol ≤1200cc / diesel ≤1500cc)',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 28,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Base 28% GST plus 1%-3% compensation cess'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 18,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): small cars moved to 18%, cess subsumed'
      }
    ]
  },
  {
    id: 'hist-bike',
    itemKeyword: 'bike',
    altKeywords: ['motorcycle', 'scooter', 'activa', 'two wheeler'],
    hsnSac: '8711',
    description: 'Two-wheelers up to 350cc',
    ranges: [
      {
        startDate: '2017-07-01',
        endDate: '2025-09-21',
        rate: 28,
        notificationRef: 'Notification No. 01/2017-CT(Rate)',
        rationale: 'Two-wheelers taxed at 28%'
      },
      {
        startDate: '2025-09-22',
        endDate: 'current',
        rate: 18,
        notificationRef: 'Notification No. 09/2025-CT(Rate)',
        rationale: 'GST 2.0 (56th GST Council): bikes up to 350cc moved to 18%; above 350cc to 40%'
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
    const keywords = [rule.itemKeyword, ...(rule.altKeywords ?? [])];
    if (keywords.some(k => queryLower.includes(k.toLowerCase()))) {
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
