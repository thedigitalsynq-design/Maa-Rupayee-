import React, { useState } from 'react';
import {
  Store,
  Utensils,
  Shirt,
  Footprints,
  Tv,
  Smartphone,
  Pill,
  Car,
  HardHat,
  Sofa,
  BedDouble,
  Truck,
  Laptop,
  Briefcase,
  Camera,
  Gem,
  Search,
  ArrowRight,
  BadgeCheck,
  Store as StoreIcon,
} from 'lucide-react';

interface TradeRate {
  code: string;
  label: string;
  rate: string;
}

interface Trade {
  id: string;
  name: string;
  tagline: string;
  icon: React.FC<{ className?: string }>;
  exampleQuery: string;
  exampleAmount: string;
  rates: TradeRate[];
  itc: string;
  rcm?: string;
}

const TRADES: Trade[] = [
  {
    id: 'kirana', name: 'Kirana & Grocery', tagline: 'Daily provisions, grains, oils & dairy',
    icon: Store, exampleQuery: 'Packaged atta 10kg ₹480', exampleAmount: '₹480',
    rates: [
      { code: '1006', label: 'Rice (packed ≤25kg)', rate: '5%' },
      { code: '1514', label: 'Edible oils', rate: '5%' },
      { code: '0405', label: 'Ghee & butter', rate: '5%' },
      { code: '1905', label: 'Biscuits & bakery', rate: '5%' },
    ],
    itc: 'Full ITC on purchases; pass 5% on packed goods, nil on loose grains.',
  },
  {
    id: 'restaurant', name: 'Restaurant & Food', tagline: 'Dining, cloud kitchen, catering',
    icon: Utensils, exampleQuery: 'Restaurant dining bill ₹2,500', exampleAmount: '₹2,500',
    rates: [
      { code: '996331', label: 'Standalone dining', rate: '5%*' },
      { code: '996331', label: '5-star hotel outlet', rate: '18%' },
      { code: '996331', label: 'Outdoor catering', rate: '5%*' },
    ],
    itc: '*5% without ITC. 18% with full ITC inside tariff ≥ ₹7,500 hotels.',
  },
  {
    id: 'apparel', name: 'Textiles & Apparel', tagline: 'Sarees, garments, fabrics',
    icon: Shirt, exampleQuery: 'Cotton Saree ₹2,400', exampleAmount: '₹2,400',
    rates: [
      { code: '5208', label: 'Unstitched saree/fabric', rate: '5%' },
      { code: '6203', label: 'Garment ≤ ₹2,500', rate: '5%' },
      { code: '6203', label: 'Garment > ₹2,500', rate: '18%' },
    ],
    itc: 'Full ITC; threshold moved ₹1,000 → ₹2,500 under GST 2.0.',
  },
  {
    id: 'footwear', name: 'Footwear', tagline: 'Shoes, sandals, leather goods',
    icon: Footprints, exampleQuery: 'Leather shoes ₹1,999', exampleAmount: '₹1,999',
    rates: [
      { code: '6403', label: 'Footwear ≤ ₹2,500', rate: '5%' },
      { code: '6403', label: 'Footwear > ₹2,500', rate: '18%' },
    ],
    itc: 'Full ITC on inputs and job-work (SAC 9988 at 5%).',
  },
  {
    id: 'electronics', name: 'Electronics & Appliances', tagline: 'TVs, ACs, fridges, LEDs',
    icon: Tv, exampleQuery: 'Samsung 55 inch TV ₹65,000', exampleAmount: '₹65,000',
    rates: [
      { code: '8528', label: 'All TVs (any size)', rate: '18%' },
      { code: '8415', label: 'Air conditioners', rate: '18%' },
      { code: '8418', label: 'Refrigerators', rate: '18%' },
      { code: '9405', label: 'LED lights', rate: '5%' },
    ],
    itc: 'Full ITC; all TVs unified at 18% since 22-09-2025.',
  },
  {
    id: 'mobile', name: 'Mobile & Computers', tagline: 'Phones, laptops, accessories',
    icon: Smartphone, exampleQuery: 'Smartphone ₹25,000', exampleAmount: '₹25,000',
    rates: [
      { code: '8517', label: 'Mobile phones', rate: '18%' },
      { code: '8471', label: 'Laptops & desktops', rate: '18%' },
    ],
    itc: 'Full ITC; B2B buyers claim input credit on devices.',
  },
  {
    id: 'pharma', name: 'Medicines & Pharma', tagline: 'Formulations, Ayurvedic, devices',
    icon: Pill, exampleQuery: 'Paracetamol strips ₹500', exampleAmount: '₹500',
    rates: [
      { code: '3004', label: 'General medicines', rate: '5%' },
      { code: '3004', label: '33 life-saving drugs', rate: 'Nil' },
    ],
    itc: 'ITC available; nil-rated lines need exempt-supply accounting.',
  },
  {
    id: 'auto', name: 'Automobiles & Spares', tagline: 'Cars, bikes, parts, service',
    icon: Car, exampleQuery: 'Small petrol car ₹7,50,000', exampleAmount: '₹7,50,000',
    rates: [
      { code: '8703', label: 'Small cars', rate: '18%' },
      { code: '8703', label: 'Large cars / SUVs', rate: '40%' },
      { code: '8711', label: 'Bikes ≤ 350cc', rate: '18%' },
      { code: '8708', label: 'Spare parts', rate: '18%' },
    ],
    itc: 'ITC on spares and services; 40% slab is all-inclusive (no cess).',
  },
  {
    id: 'construction', name: 'Construction & Hardware', tagline: 'Cement, steel, tiles, paint',
    icon: HardHat, exampleQuery: 'Ultratech cement 50 bags ₹19,000', exampleAmount: '₹19,000',
    rates: [
      { code: '2523', label: 'Cement', rate: '18%' },
      { code: '7214', label: 'TMT steel bars', rate: '18%' },
      { code: '6907', label: 'Ceramic tiles', rate: '18%' },
    ],
    itc: 'Full ITC for contractors and builders (works contract 18%).',
  },
  {
    id: 'furniture', name: 'Furniture & Decor', tagline: 'Wooden, office, home furniture',
    icon: Sofa, exampleQuery: 'Office chairs 6 pcs ₹48,000', exampleAmount: '₹48,000',
    rates: [{ code: '9403', label: 'All furniture', rate: '18%' }],
    itc: 'Full ITC; delivery + installation billed as composite supply.',
  },
  {
    id: 'hotel', name: 'Hotel & Hospitality', tagline: 'Rooms, resorts, guest houses',
    icon: BedDouble, exampleQuery: 'Hotel room 2 nights ₹9,000', exampleAmount: '₹9,000',
    rates: [
      { code: '996311', label: 'Room ≤ ₹7,500/day', rate: '5%' },
      { code: '996311', label: 'Room > ₹7,500/day', rate: '18%' },
    ],
    itc: 'ITC on hotel inputs; restaurant inside follows hotel slab rules.',
  },
  {
    id: 'transport', name: 'Transport & GTA', tagline: 'Freight, logistics, cabs',
    icon: Truck, exampleQuery: 'Freight transport GTA ₹45,000', exampleAmount: '₹45,000',
    rates: [
      { code: '996511', label: 'GTA (RCM / no ITC)', rate: '5%' },
      { code: '996511', label: 'GTA forward + ITC', rate: '12%' },
      { code: '996412', label: 'AC cab / bus', rate: '5%*' },
    ],
    itc: '5% without ITC, or 12% with ITC under forward charge.',
    rcm: 'GTA freight is typically reverse charge — the recipient pays the tax.',
  },
  {
    id: 'it', name: 'IT Services & SaaS', tagline: 'Software, cloud, freelancers',
    icon: Laptop, exampleQuery: 'IT Consultancy Services ₹85,000', exampleAmount: '₹85,000',
    rates: [
      { code: '998314', label: 'Software / SaaS', rate: '18%' },
      { code: '998361', label: 'Digital marketing', rate: '18%' },
    ],
    itc: 'Full ITC; exports are zero-rated (LUT/bond, no tax on foreign clients).',
  },
  {
    id: 'professional', name: 'Professional Services', tagline: 'CA, legal, design, consultancy',
    icon: Briefcase, exampleQuery: 'Legal Consultancy Services ₹35,000', exampleAmount: '₹35,000',
    rates: [
      { code: '998211', label: 'Legal services', rate: '18%' },
      { code: '998399', label: 'Consultancy / design', rate: '18%' },
    ],
    itc: 'Full ITC on office inputs and sub-contracted services.',
    rcm: 'Advocate services to business clients are reverse charge.',
  },
  {
    id: 'media', name: 'Photo, Video & Events', tagline: 'Shoots, production, rentals',
    icon: Camera, exampleQuery: 'Wedding photography ₹60,000', exampleAmount: '₹60,000',
    rates: [
      { code: '998381', label: 'Photography / video', rate: '18%' },
      { code: '999612', label: 'Film production', rate: '18%' },
      { code: '997311', label: 'Equipment rental', rate: '18%' },
    ],
    itc: 'Full ITC on cameras, gear and studio rent.',
  },
  {
    id: 'jewellery', name: 'Jewellery & Gems', tagline: 'Gold, silver, diamonds',
    icon: Gem, exampleQuery: 'Gold chain 20g ₹1,50,000', exampleAmount: '₹1,50,000',
    rates: [
      { code: '7113', label: 'Gold / silver jewellery', rate: '3%' },
      { code: '7102', label: 'Rough diamonds', rate: '0.25%' },
      { code: '998314', label: 'Making charges', rate: '5%' },
    ],
    itc: 'ITC on making inputs; 3% on metal value is the headline levy.',
  },
];

interface BusinessHubProps {
  onTryExample: (query: string) => void;
  onOpenCalculator: () => void;
  isClassifying: boolean;
}

export const BusinessHub: React.FC<BusinessHubProps> = ({ onTryExample, onOpenCalculator, isClassifying }) => {
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();
  const trades = TRADES.filter(t =>
    !q || t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q) ||
    t.rates.some(r => r.label.toLowerCase().includes(q) || r.code.includes(q))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <StoreIcon className="h-3.5 w-3.5" />
          <span>Every Trade Welcome • Pick Your Business</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">GST Counter for Every Business</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Choose your trade to see the GST rates, HSN/SAC codes and ITC position that apply to you — then run a live calculation with one tap.
        </p>
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search your trade — hotel, Salon, timber, bakery…"
            aria-label="Search business trade"
            className="w-full pl-10 pr-4 py-2.5 glass-pill rounded-full text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder:text-zinc-500"
          />
        </div>
      </div>

      {trades.length === 0 && (
        <div className="p-8 rounded-3xl glass-card text-center text-xs text-zinc-500">
          No trade matched “{filter}”. Try the HSN/SAC Directory or run any bill through GST Intelligence — it classifies anything.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trades.map(t => {
          const Icon = t.icon;
          return (
            <div key={t.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-white/25 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="icon-tile icon-tile-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black tracking-tight">{t.name}</h3>
                      <p className="text-[11px] text-zinc-500">{t.tagline}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {t.rates.map(r => (
                    <div key={r.code + r.label} className="p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold">{r.code}</span>
                        <span className="font-black font-mono">{r.rate}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">{r.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed flex items-start gap-1.5 mb-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 mt-px" />
                  <span>{t.itc}</span>
                </p>
                {t.rcm && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed flex items-start gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 mt-px" />
                    <span><strong>RCM:</strong> {t.rcm}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={isClassifying}
                  onClick={() => onTryExample(`${t.exampleQuery}`)}
                  className="px-3.5 py-2 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-black disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Calculate {t.exampleAmount}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="px-3.5 py-2 rounded-full glass-pill text-xs font-bold transition-all cursor-pointer"
                >
                  Open Calculator
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
