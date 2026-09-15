import { GSTItem } from '../types';

export const GST_DATABASE: GSTItem[] = [
  // ==================== ELECTRONICS & CONSUMER APPLIANCES ====================
  {
    code: '8528',
    type: 'GOODS',
    category: 'Consumer Electronics',
    subCategory: 'Television & Monitors',
    description: 'Monitors and projectors, television reception apparatus (LED, OLED, Smart TV)',
    keywords: ['tv', 'television', 'samsung tv', 'lg tv', 'sony tv', 'smart tv', 'oled', 'led tv', 'monitor', 'screen', '55 inch', '65 inch', '43 inch', '32 inch'],
    gstRate: 18, // GST 2.0: ALL televisions unified at 18% w.e.f. 22-09-2025 (large-screen 28% abolished)
    applicableConditions: 'All televisions (LED, OLED, QLED, Smart TV) attract a uniform 18% GST since 22-09-2025. Screen-size distinction abolished under the 56th GST Council reforms (Notification No. 09/2025-CT(Rate)).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 18, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: all TVs unified at 18%; above-32-inch 28% slab abolished' },
      { effectiveDate: '2019-01-01', rate: 18, notificationNo: '24/2018-CT(Rate)', notes: 'Rate on TVs up to 32 inches reduced from 28% to 18% (above 32 inches stayed at 28%)' },
      { effectiveDate: '2017-07-01', rate: 28, notificationNo: '01/2017-CT(Rate)', notes: 'Initial GST rate for all televisions was 28%' }
    ]
  },
  {
    code: '8517',
    type: 'GOODS',
    category: 'Consumer Electronics',
    subCategory: 'Mobile Phones & Smartphones',
    description: 'Telephone sets, smartphones, iPhones, feature phones and parts',
    keywords: ['iphone', 'mobile', 'smartphone', 'samsung galaxy', 'oneplus', 'redmi', 'pixel', 'cellphone', 'handset', 'phone'],
    gstRate: 18,
    applicableConditions: 'Mobile phones and parts (other than specified components) attract 18% GST. Rate was hiked from 12% to 18% in April 2020.',
    source: 'CBIC Notification No. 03/2020-CT(Rate) dt. 25-03-2020',
    lastVerified: 'October 2024',
    historicalRates: [
      { effectiveDate: '2020-04-01', rate: 18, notificationNo: '03/2020-CT(Rate)', notes: 'GST rate on mobile phones and parts increased from 12% to 18%' },
      { effectiveDate: '2017-07-01', rate: 12, notificationNo: '01/2017-CT(Rate)', notes: 'Initial GST rate on mobile handsets was 12%' }
    ]
  },
  {
    code: '8471',
    type: 'GOODS',
    category: 'Information Technology Hardware',
    subCategory: 'Computers & Laptops',
    description: 'Automatic data processing machines, laptops, desktops, servers, microcomputers',
    keywords: ['laptop', 'macbook', 'computer', 'desktop', 'pc', 'server', 'thinkpad', 'dell laptop', 'hp laptop', 'asus laptop'],
    gstRate: 18,
    applicableConditions: 'Computers, laptops, and peripheral hardware attract standard 18% GST with full ITC eligible for business use.',
    source: 'CBIC Schedule III - Sl. No. 360',
    lastVerified: 'September 2024'
  },
  {
    code: '8415',
    type: 'GOODS',
    category: 'Consumer Appliances',
    subCategory: 'Air Conditioners',
    description: 'Air conditioning machines comprising a motor-driven fan and elements for changing temperature and humidity',
    keywords: ['ac', 'air conditioner', 'split ac', 'window ac', 'inverter ac', 'daikin', 'voltas', 'bluestar'],
    gstRate: 18,
    applicableConditions: 'Air conditioners attract 18% GST since 22-09-2025 (reduced from the 28% luxury slab under GST 2.0).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 18, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: ACs moved from 28% luxury slab to 18%' },
      { effectiveDate: '2017-07-01', rate: 28, notificationNo: '01/2017-CT(Rate)', notes: 'ACs taxed at peak 28% as luxury consumer appliances' }
    ]
  },
  {
    code: '8418',
    type: 'GOODS',
    category: 'Consumer Appliances',
    subCategory: 'Refrigerators',
    description: 'Refrigerators, freezers and other refrigerating or freezing equipment',
    keywords: ['refrigerator', 'fridge', 'deep freezer', 'double door fridge', 'single door fridge', 'whirlpool', 'godrej fridge'],
    gstRate: 18,
    applicableConditions: 'Refrigerators and household cooling appliances attract 18% GST (reduced from 28% in 2018).',
    source: 'CBIC Notification No. 18/2018-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '9405',
    type: 'GOODS',
    category: 'Electrical & Lighting',
    subCategory: 'LED Lights',
    description: 'Lamps and lighting fittings; LED lights, fixtures, and LED bulbs',
    keywords: ['led', 'led bulb', 'lighting', 'tube light', 'philips led', 'lamp', 'ceiling light'],
    gstRate: 5,
    applicableConditions: 'LED lamps, lights and fixtures attract 5% GST since 22-09-2025 (12% slab merged under GST 2.0).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: 12% slab abolished, LED lights moved to 5%' },
      { effectiveDate: '2017-07-01', rate: 12, notificationNo: '41/2017-CT(Rate)', notes: 'LED lamps taxed at 12% under HSN 9405' }
    ]
  },

  // ==================== TEXTILES, SAREES & APPAREL ====================
  {
    code: '5208',
    type: 'GOODS',
    category: 'Textiles & Apparel',
    subCategory: 'Sarees & Fabrics',
    description: 'Woven fabrics of cotton, cotton sarees, dhotis and traditional unstitched garments',
    keywords: ['saree', 'sari', 'cotton saree', 'silk saree', 'kanjivaram', 'banarasi', 'chiffon saree', 'georgette', 'pattu saree', 'sarees'],
    gstRate: 5,
    applicableConditions: 'Sarees treated as unstitched fabric attract 5% GST regardless of value. Stitched garments attract 5% if sale value <= ₹2,500 and 18% if > ₹2,500 (threshold raised from ₹1,000 under GST 2.0 w.e.f. 22-09-2025).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    ambiguityQuestions: [
      {
        id: 'saree_fabric_type',
        question: 'What is the material composition or form of the Saree?',
        options: [
          { label: 'Unstitched Saree / Traditional Fabric (Cotton/Silk/Synthetic)', rate: 5, hsn: '5208 / 5007', conditionNote: 'All unstitched sarees attract 5% GST irrespective of value' },
          { label: 'Ready-to-wear / Designer stitched saree (> ₹2,500 value)', rate: 18, hsn: '6211', conditionNote: 'Ready-made / stitched garments exceeding ₹2,500 attract 18% GST (GST 2.0)' },
          { label: 'Ready-to-wear stitched saree (<= ₹2,500 value)', rate: 5, hsn: '6211', conditionNote: 'Ready-made garments up to ₹2,500 attract 5% GST (GST 2.0)' },
          { label: 'Embroidery / Job work on saree', rate: 5, hsn: '9988', conditionNote: 'Job work on textile products attracts 5% SAC 9988' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: apparel value threshold raised from ₹1,000 to ₹2,500; above-threshold rate is now 18% (12% slab abolished)' },
      { effectiveDate: '2022-01-01', rate: 5, notificationNo: '46th GST Council Deferred', notes: 'Proposed hike to 12% on all textiles was deferred/rolled back by GST Council' }
    ]
  },
  {
    code: '6203',
    type: 'GOODS',
    category: 'Textiles & Apparel',
    subCategory: 'Ready-made Garments & Clothing',
    description: 'Articles of apparel and clothing accessories (Shirts, trousers, suits, dresses, kurtas, t-shirts)',
    keywords: ['clothing', 'shirt', 't-shirt', 'jeans', 'trousers', 'kurta', 'dress', 'apparel', 'garment', 'suit', 'jacket'],
    gstRate: 5,
    applicableConditions: 'Articles of apparel with sale value up to ₹2,500 per piece attract 5% GST; above ₹2,500 attract 18% (threshold raised from ₹1,000 and 12% slab abolished under GST 2.0 w.e.f. 22-09-2025).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    ambiguityQuestions: [
      {
        id: 'apparel_value_tier',
        question: 'What is the sale price per piece?',
        options: [
          { label: 'Value exceeding ₹2,500 per piece', rate: 18, hsn: '6203', conditionNote: 'Apparel > ₹2,500 attracts 18% GST (GST 2.0)' },
          { label: 'Value up to ₹2,500 per piece', rate: 5, hsn: '6203', conditionNote: 'Apparel <= ₹2,500 attracts concessionary 5% GST (GST 2.0)' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: threshold raised to ₹2,500; above-threshold rate is 18% (12% slab abolished)' },
      { effectiveDate: '2017-07-01', rate: 12, notificationNo: '01/2017-CT(Rate)', notes: 'Apparel above ₹1,000 was taxed at 12% (up to ₹1,000 at 5%)' }
    ]
  },
  {
    code: '6403',
    type: 'GOODS',
    category: 'Footwear & Leather',
    subCategory: 'Shoes, Sandals & Chappals',
    description: 'Footwear with outer soles of rubber, plastics, leather or composition leather',
    keywords: ['footwear', 'shoes', 'sandals', 'chappal', 'slippers', 'sneakers', 'leather shoes', 'boots', 'heels'],
    gstRate: 5,
    applicableConditions: 'Footwear with retail sale price up to ₹2,500 attracts 5% GST; above ₹2,500 attracts 18% (GST 2.0 threshold revision w.e.f. 22-09-2025).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    ambiguityQuestions: [
      {
        id: 'footwear_value_tier',
        question: 'What is the retail sale price per pair?',
        options: [
          { label: 'Up to ₹2,500 per pair', rate: 5, hsn: '6403', conditionNote: 'Footwear <= ₹2,500 attracts 5% GST (GST 2.0)' },
          { label: 'Above ₹2,500 per pair', rate: 18, hsn: '6403', conditionNote: 'Footwear > ₹2,500 attracts 18% GST (GST 2.0)' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: footwear up to ₹2,500 moved to 5% (12% slab abolished)' },
      { effectiveDate: '2022-01-01', rate: 12, notificationNo: '14/2021-CT(Rate)', notes: 'GST rate on all footwear (including <= ₹1,000) unified to 12%' },
      { effectiveDate: '2017-07-01', rate: 5, notificationNo: '01/2017-CT(Rate)', notes: 'Initial rate for footwear <= ₹1,000 was 5%, and > ₹1,000 was 18%' }
    ]
  },

  // ==================== KIRANA, FMCG & FOOD PRODUCTS ====================
  {
    code: '1006',
    type: 'GOODS',
    category: 'Kirana & Food Grains',
    subCategory: 'Rice & Grains',
    description: 'Rice, basmati rice, non-basmati rice, paddy',
    keywords: ['rice', 'basmati', 'chawal', 'paddy', 'daawat', 'fortune rice', 'loose rice'],
    gstRate: 5,
    applicableConditions: 'Pre-packaged and labelled rice (up to 25 kg) attracts 5% GST. Unbranded/loose rice or pre-packaged packages containing quantity > 25 kg are EXEMPT (0% GST).',
    source: 'CBIC Notification No. 06/2022-CT(Rate) dt. 13-07-2022',
    lastVerified: 'October 2024',
    ambiguityQuestions: [
      {
        id: 'rice_packaging',
        question: 'How is the rice sold and packaged?',
        options: [
          { label: 'Pre-packaged & labelled retail pack (<= 25 kg / 25 litres)', rate: 5, hsn: '1006', conditionNote: 'Pre-packaged and labelled attracts 5% GST' },
          { label: 'Loose / Unbranded / Bulk pack exceeding 25 kg (e.g. 50 kg sack)', rate: 0, hsn: '1006', conditionNote: 'Sold loose or in bulk package > 25kg is Nil/Exempt' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2022-07-18', rate: 5, notificationNo: '06/2022-CT(Rate)', notes: '47th GST Council decision: 5% tax applied to pre-packaged and labelled food grains' },
      { effectiveDate: '2017-07-01', rate: 0, notificationNo: '02/2017-CT(Rate)', notes: 'Unbranded grains were initially 0% tax' }
    ]
  },
  {
    code: '1101',
    type: 'GOODS',
    category: 'Kirana & Food Grains',
    subCategory: 'Wheat Flour & Atta',
    description: 'Wheat or meslin flour (Atta, Maida, Sooji)',
    keywords: ['atta', 'wheat flour', 'aashirvaad atta', 'maida', 'sooji', 'flour', 'chakki atta'],
    gstRate: 5,
    applicableConditions: 'Pre-packaged and labelled wheat flour/atta attracts 5% GST. Loose sold atta is exempt (0%).',
    source: 'CBIC Notification No. 06/2022-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '1514',
    type: 'GOODS',
    category: 'Kirana & FMCG',
    subCategory: 'Edible Oils',
    description: 'Mustard oil, sunflower oil, soyabean oil, palm oil and other edible vegetable oils',
    keywords: ['oil', 'mustard oil', 'cooking oil', 'edible oil', 'sunflower oil', 'fortune oil', 'groundnut oil', 'dhara'],
    gstRate: 5,
    applicableConditions: 'Edible grade vegetable oils of all varieties attract 5% GST.',
    source: 'CBIC Schedule I - Sl. No. 90',
    lastVerified: 'September 2024'
  },
  {
    code: '0405',
    type: 'GOODS',
    category: 'Dairy Products',
    subCategory: 'Butter & Ghee',
    description: 'Butter and other fats and oils derived from milk; dairy spreads and pure desi ghee',
    keywords: ['ghee', 'desi ghee', 'butter', 'amul butter', 'amul ghee', 'dairy', 'makhan'],
    gstRate: 5,
    applicableConditions: 'Butter, ghee, butter oil, dairy spreads and cheese attract 5% GST since 22-09-2025 (reduced from 12% under GST 2.0).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: butter, ghee and cheese moved from 12% to 5%' },
      { effectiveDate: '2017-07-01', rate: 12, notificationNo: '01/2017-CT(Rate)', notes: 'Butter, ghee and cheese taxed at 12% under HSN 0405/0406' }
    ]
  },
  {
    code: '0401',
    type: 'GOODS',
    category: 'Dairy Products',
    subCategory: 'Fresh Milk & Curd',
    description: 'Fresh milk, pasteurized milk (not condensed or sweetened), loose curd',
    keywords: ['milk', 'fresh milk', 'doodh', 'loose curd', 'amul milk', 'nandini milk', 'mother dairy'],
    gstRate: 0,
    isExempt: true,
    applicableConditions: 'Fresh milk, pasteurized milk, loose curd, paneer and buttermilk are wholly exempt (0% GST). Pre-packaged curd/paneer attracts 5%.',
    source: 'CBIC Notification No. 02/2017-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '1905',
    type: 'GOODS',
    category: 'Kirana & FMCG',
    subCategory: 'Biscuits & Bakery',
    description: 'Bread, pastry, cakes, biscuits and other bakers wares (Parle-G, Britannia, cookies)',
    keywords: ['biscuit', 'biscuits', 'cookies', 'parle g', 'good day', 'rusk', 'cake', 'bakery'],
    gstRate: 5,
    applicableConditions: 'Biscuits, cookies, cakes, pastries, namkeens and bakery wares attract 5% GST since 22-09-2025 (reduced from 18%/12% under GST 2.0).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: biscuits and bakery wares moved from 18% to 5%' },
      { effectiveDate: '2017-07-01', rate: 18, notificationNo: '01/2017-CT(Rate)', notes: 'All biscuits and bakery wares taxed at 18%' }
    ]
  },
  {
    code: '0904',
    type: 'GOODS',
    category: 'Kirana & Spices',
    subCategory: 'Spices & Masalas',
    description: 'Pepper, turmeric, cardamom, chilli, coriander, cumin seeds and branded mixed spices',
    keywords: ['spices', 'masala', 'turmeric', 'haldi', 'mirchi', 'jeera', 'cardamom', 'elaichi', 'garam masala', 'mdh', 'everest'],
    gstRate: 5,
    applicableConditions: 'Whole and ground spices attract 5% GST.',
    source: 'CBIC Schedule I - Sl. No. 43-52',
    lastVerified: 'September 2024'
  },

  // ==================== MEDICINES & HEALTHCARE ====================
  {
    code: '3004',
    type: 'GOODS',
    category: 'Healthcare & Pharmaceuticals',
    subCategory: 'Medicines & Formulations',
    description: 'Medicaments consisting of mixed or unmixed products for therapeutic or prophylactic uses',
    keywords: ['medicine', 'medicines', 'tablets', 'syrup', 'paracetamol', 'antibiotic', 'insulin', 'pharma', 'drugs', 'cancer drug'],
    gstRate: 5,
    applicableConditions: 'Most formulations attract 5% GST since 22-09-2025 under GST 2.0. 33 specified life-saving drugs are fully exempt (0%). Earlier: general 12%, with specified cancer drugs (Trastuzumab, Osimertinib, Durvalumab) at 5% from Oct 2024.',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    ambiguityQuestions: [
      {
        id: 'medicine_type',
        question: 'What category of medicament is this?',
        options: [
          { label: 'General allopathic formulations & antibiotics (e.g. Paracetamol, Cough syrup)', rate: 5, hsn: '3004', conditionNote: 'Standard formulations attract 5% GST since 22-09-2025 (GST 2.0)' },
          { label: '33 specified life-saving drugs (nil list, e.g. Agalsidase Alfa, Onasemnogene)', rate: 0, hsn: '3004', conditionNote: 'Exempt (0%) w.e.f. 22-09-2025 as per 56th GST Council' },
          { label: 'Ayurvedic / Unani / Siddha branded medicaments', rate: 5, hsn: '3004', conditionNote: 'Branded traditional medicines attract 5% GST since 22-09-2025 (GST 2.0)' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: most medicines moved from 12% to 5%; 33 life-saving drugs exempted' },
      { effectiveDate: '2024-10-10', rate: 5, notificationNo: '05/2024-CT(Rate)', notes: 'GST rate on three major cancer drugs reduced from 12% to 5%' }
    ]
  },

  // ==================== AUTOMOBILES, SPARES & FUELS ====================
  {
    code: '8703',
    type: 'GOODS',
    category: 'Automobiles & Vehicles',
    subCategory: 'Motor Cars & Passenger Vehicles',
    description: 'Motor cars and other motor vehicles principally designed for the transport of persons',
    keywords: ['car', 'motor car', 'automobile', 'petrol car', 'diesel car', 'suv', 'sedan', 'creta', 'maruti', 'hyundai', 'tata car'],
    gstRate: 18,
    cessRate: 0, // Compensation cess subsumed under GST 2.0; 40% demerit slab is all-inclusive
    applicableConditions: 'Small cars (petrol <= 1200cc / diesel <= 1500cc, length < 4m) attract 18% GST since 22-09-2025. Larger cars, SUVs and luxury vehicles attract a 40% demerit rate (all-inclusive, no separate cess). Electric Vehicles stay at 5%.',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    ambiguityQuestions: [
      {
        id: 'car_powertrain',
        question: 'What type of vehicle engine / propulsion?',
        options: [
          { label: 'Electric Vehicle (EV / Battery operated)', rate: 5, hsn: '8703', conditionNote: 'Electric Vehicles attract special concessionary 5% GST' },
          { label: 'Small Petrol / CNG Car (<= 1200cc, length < 4m)', rate: 18, hsn: '8703', conditionNote: '18% GST, no compensation cess (GST 2.0)' },
          { label: 'Small Diesel Car (<= 1500cc, length < 4m)', rate: 18, hsn: '8703', conditionNote: '18% GST, no compensation cess (GST 2.0)' },
          { label: 'Large car / SUV (bigger engine or length >= 4m)', rate: 40, hsn: '8703', conditionNote: '40% demerit rate, all-inclusive (GST 2.0)' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 18, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: small cars 28%+cess to 18%; large cars/SUVs to all-inclusive 40%; cess subsumed' },
      { effectiveDate: '2017-07-01', rate: 28, notificationNo: '01/2017-CT(Rate)', notes: 'Base 28% GST plus 1%-22% compensation cess depending on size and engine' }
    ]
  },
  {
    code: '8711',
    type: 'GOODS',
    category: 'Automobiles & Vehicles',
    subCategory: 'Motorcycles & Two-Wheelers',
    description: 'Motorcycles (including mopeds) and cycles fitted with an auxiliary motor',
    keywords: ['bike', 'motorcycle', 'scooter', 'activa', 'splendor', 'royal enfield', 'pulsar', 'two wheeler'],
    gstRate: 18,
    applicableConditions: 'Two-wheelers up to 350cc attract 18% GST since 22-09-2025 (GST 2.0). Motorcycles above 350cc attract a 40% demerit rate. Electric two-wheelers stay at 5%.',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    ambiguityQuestions: [
      {
        id: 'bike_engine',
        question: 'What is the engine capacity?',
        options: [
          { label: 'Up to 350cc (commuter bikes, scooters)', rate: 18, hsn: '8711', conditionNote: '18% GST since 22-09-2025 (GST 2.0)' },
          { label: 'Above 350cc (premium / superbikes)', rate: 40, hsn: '8711', conditionNote: '40% demerit rate since 22-09-2025 (GST 2.0)' },
          { label: 'Electric two-wheeler (Ather, Ola, etc.)', rate: 5, hsn: '8711', conditionNote: 'Concessionary 5% GST for EVs' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 18, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: bikes up to 350cc moved from 28% to 18%; above 350cc to 40%' },
      { effectiveDate: '2017-07-01', rate: 28, notificationNo: '01/2017-CT(Rate)', notes: 'Standard petrol two-wheelers taxed at 28%' }
    ]
  },
  {
    code: '8708',
    type: 'GOODS',
    category: 'Automobiles & Spares',
    subCategory: 'Automobile Spare Parts',
    description: 'Parts and accessories of motor vehicles, brakes, gear boxes, drive-axles, radiators',
    keywords: ['spare parts', 'auto parts', 'car spare', 'brake pad', 'clutch plate', 'oil filter', 'engine parts'],
    gstRate: 18,
    applicableConditions: 'Automobile components and spare parts attract a uniform 18% GST since 22-09-2025 (GST 2.0).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 18, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: auto parts moved from 28% to uniform 18%' },
      { effectiveDate: '2017-07-01', rate: 28, notificationNo: '01/2017-CT(Rate)', notes: 'Auto components taxed at 28% under Chapter 8708' }
    ]
  },

  // ==================== CONSTRUCTION MATERIALS & FURNITURE ====================
  {
    code: '2523',
    type: 'GOODS',
    category: 'Construction Materials',
    subCategory: 'Cement',
    description: 'Portland cement, aluminous cement, slag cement and similar hydraulic cements',
    keywords: ['cement', 'ultratech', 'ambuja', 'acc cement', 'portland cement', 'grey cement'],
    gstRate: 18,
    applicableConditions: 'All varieties of cement attract 18% GST since 22-09-2025 (reduced from 28% under GST 2.0).',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 18, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: cement moved from peak 28% to 18%' },
      { effectiveDate: '2017-07-01', rate: 28, notificationNo: '01/2017-CT(Rate)', notes: 'Cement taxed at peak 28% rate' }
    ]
  },
  {
    code: '7214',
    type: 'GOODS',
    category: 'Construction Materials',
    subCategory: 'Steel & TMT Rebars',
    description: 'Other bars and rods of iron or non-alloy steel; TMT rebars for construction reinforcement',
    keywords: ['steel', 'tmt bar', 'rebar', 'iron rod', 'tata tiscon', 'jsw steel', 'reinforcement steel'],
    gstRate: 18,
    applicableConditions: 'Iron and steel construction materials, rebars and structural angles attract 18% GST.',
    source: 'CBIC Schedule III - Sl. No. 209',
    lastVerified: 'September 2024'
  },
  {
    code: '6907',
    type: 'GOODS',
    category: 'Construction Materials',
    subCategory: 'Ceramic & Vitrified Tiles',
    description: 'Ceramic flags and paving, hearth or wall tiles; vitrified tiles and glazed ceramic tiles',
    keywords: ['tiles', 'vitrified tiles', 'ceramic tiles', 'flooring tiles', 'wall tiles', 'kajaria', 'somany'],
    gstRate: 18,
    applicableConditions: 'Ceramic and vitrified tiles attract 18% GST (reduced from 28% in 2017).',
    source: 'CBIC Notification No. 41/2017-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '9403',
    type: 'GOODS',
    category: 'Furniture & Fixtures',
    subCategory: 'Wooden & Metal Furniture',
    description: 'Other furniture and parts thereof, office furniture, wooden desks, chairs, sofas',
    keywords: ['furniture', 'sofa', 'table', 'chair', 'bed', 'office chair', 'dining table', 'desk', 'wardrobe'],
    gstRate: 18,
    applicableConditions: 'Furniture of all types (wood, metal, plastic) attracts 18% GST under HSN 9403.',
    source: 'CBIC Notification No. 41/2017-CT(Rate)',
    lastVerified: 'September 2024'
  },

  // ==================== JEWELLERY & PRECIOUS METALS ====================
  {
    code: '7113',
    type: 'GOODS',
    category: 'Jewellery & Gems',
    subCategory: 'Gold & Silver Jewellery',
    description: 'Articles of jewellery and parts thereof, of precious metal (gold chains, bangles, rings, silverware)',
    keywords: ['gold', 'silver', 'jewellery', 'jewelry', 'chain', 'bangle', 'ring', 'necklace', 'ornament', 'bullion'],
    gstRate: 3,
    applicableConditions: 'Gold, silver and studded jewellery attract 3% GST on metal value; making charges billed separately attract 5%. Rough diamonds at 0.25%.',
    source: 'CBIC Schedule IV(3%) / Notification No. 11/2017-CT(Rate) for making charges',
    lastVerified: 'September 2025 (56th GST Council)',
    historicalRates: [
      { effectiveDate: '2017-07-01', rate: 3, notificationNo: '01/2017-CT(Rate)', notes: 'Jewellery taxed at special 3% slab since GST rollout' }
    ]
  },

  // ==================== BOOKS & STATIONERY ====================
  {
    code: '4901',
    type: 'GOODS',
    category: 'Education & Stationery',
    subCategory: 'Books & Educational Literature',
    description: 'Printed books, brochures, leaflets and similar printed matter, textbooks, children picture books',
    keywords: ['book', 'books', 'textbook', 'novel', 'ncert', 'educational books', 'dictionary'],
    gstRate: 0,
    isExempt: true,
    applicableConditions: 'Printed books (other than workbooks/coloring books for children which are also mostly nil) are 100% exempt from GST (0%).',
    source: 'CBIC Notification No. 02/2017-CT(Rate) - Sl. No. 119',
    lastVerified: 'September 2024'
  },

  // ==================== SERVICES (SAC CODES) ====================
  // IT, Software & SaaS
  {
    code: '998314',
    type: 'SERVICES',
    category: 'Information Technology & SaaS',
    subCategory: 'Software & Cloud Services',
    description: 'Information technology (IT) design and development services, SaaS subscription, cloud hosting, software licensing',
    keywords: ['saas', 'software', 'it service', 'software development', 'cloud hosting', 'aws', 'app development', 'subscription', 'api', 'tech support'],
    gstRate: 18,
    applicableConditions: 'Standard 18% GST applies under SAC 9983. Export of services to foreign clients is zero-rated (0% with LUT/bond or refund of IGST).',
    source: 'CBIC Notification No. 11/2017-CT(Rate) - SAC 9983',
    lastVerified: 'September 2024'
  },
  {
    code: '998361',
    type: 'SERVICES',
    category: 'Digital Services & Marketing',
    subCategory: 'Advertising & Marketing',
    description: 'Advertising services, planning, creating and placement services; digital advertising, Google Ads, Meta Ads management, SEO',
    keywords: ['advertising', 'digital marketing', 'ads', 'google ads', 'meta ads', 'seo', 'social media marketing', 'branding'],
    gstRate: 18,
    applicableConditions: 'Digital marketing and advertising services attract 18% GST under SAC 9983.',
    source: 'CBIC Notification No. 11/2017-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '998399',
    type: 'SERVICES',
    category: 'Professional Services',
    subCategory: 'Consultancy & Design',
    description: 'Other professional, scientific and technical services; management consultancy, graphic design, architecture, interior design',
    keywords: ['consultancy', 'consulting', 'graphic design', 'logo design', 'interior design', 'architect', 'advisory', 'business consultant'],
    gstRate: 18,
    applicableConditions: 'Professional design and advisory services attract 18% GST with eligibility for full input tax credit.',
    source: 'CBIC Notification No. 11/2017-CT(Rate) - SAC 9983',
    lastVerified: 'September 2024'
  },

  // Media, Film Production, Equipment Rental & Photography
  {
    code: '997311',
    type: 'SERVICES',
    category: 'Media & Entertainment',
    subCategory: 'Equipment Rental & Leasing',
    description: 'Leasing or rental services concerning machinery and equipment without operator (Camera rent, cine lighting, sound gear, lenses)',
    keywords: ['camera rent', 'camera rental', 'equipment rental', 'shooting equipment', 'film gear', 'lens rental', 'sound equipment rent', 'generator rental'],
    gstRate: 18,
    applicableConditions: 'Rental of shooting equipment without operator attracts 18% GST under SAC 9973. If supplied with operator as a technical service, covered under SAC 9996 / 9983 at 18%.',
    source: 'CBIC Notification No. 11/2017-CT(Rate) as amended by 22/2019-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '998381',
    type: 'SERVICES',
    category: 'Media & Photography',
    subCategory: 'Photography & Videography',
    description: 'Photographic and videographic services; commercial photography, event coverage, wedding photography, portfolio shoot',
    keywords: ['photography', 'videography', 'photo shoot', 'wedding shoot', 'video production', 'drone shoot', 'photographer'],
    gstRate: 18,
    applicableConditions: 'Professional photography and video shooting services attract 18% GST under SAC 9983.',
    source: 'CBIC Notification No. 11/2017-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '999612',
    type: 'SERVICES',
    category: 'Media & Entertainment',
    subCategory: 'Film & Video Production',
    description: 'Motion picture, videotape and television programme production services, editing, dubbing, VFX, sound mixing',
    keywords: ['film production', 'video production', 'movie making', 'ad film', 'post production', 'vfx', 'editing', 'dubbing'],
    gstRate: 18,
    applicableConditions: 'Film and audio-visual production services attract 18% GST.',
    source: 'CBIC Notification No. 11/2017-CT(Rate) - SAC 9996',
    lastVerified: 'September 2024'
  },

  // Hospitality & Restaurants
  {
    code: '996331',
    type: 'SERVICES',
    category: 'Hospitality & Food Services',
    subCategory: 'Restaurant & Catering Services',
    description: 'Services provided by restaurants, cafes, food outlets, cloud kitchens and outdoor catering',
    keywords: ['restaurant', 'restaurant bill', 'food bill', 'cafe', 'dining', 'catering', 'swiggy', 'zomato', 'food order'],
    gstRate: 5,
    applicableConditions: 'Standalone restaurants (whether AC or non-AC) attract 5% GST without Input Tax Credit (ITC). Restaurants in declared hotel room tariff >= ₹7,500 attract 18% with ITC.',
    source: 'CBIC Notification No. 46/2017-Central Tax (Rate)',
    lastVerified: 'September 2024',
    ambiguityQuestions: [
      {
        id: 'restaurant_context',
        question: 'Where is the restaurant located or what type of service?',
        options: [
          { label: 'Standalone restaurant / cafe / cloud kitchen (Normal dining / delivery)', rate: 5, hsn: '9963', conditionNote: '5% GST without Input Tax Credit (ITC)' },
          { label: 'Restaurant located within a luxury hotel (Room tariff ₹7,500 or more)', rate: 18, hsn: '9963', conditionNote: '18% GST with full Input Tax Credit' },
          { label: 'Outdoor catering service for events/functions', rate: 5, hsn: '9963', conditionNote: '5% GST without ITC (or 18% if supplied in luxury hotel premises)' }
        ]
      }
    ]
  },
  {
    code: '996311',
    type: 'SERVICES',
    category: 'Hospitality & Accommodation',
    subCategory: 'Hotel Accommodation',
    description: 'Room or unit accommodation services provided by hotels, inns, guest houses, clubs or campsites',
    keywords: ['hotel', 'hotel room', 'resort', 'stay', 'room booking', 'guest house', 'oyo', 'taj hotel', 'room rent'],
    gstRate: 5,
    applicableConditions: 'Hotel accommodation with declared room tariff up to ₹7,500 per day attracts 5% GST since 22-09-2025 (GST 2.0). Tariff exceeding ₹7,500 per day attracts 18% GST.',
    source: 'CBIC Notification No. 09/2025-CT(Rate) - 56th GST Council (GST 2.0), w.e.f. 22-09-2025',
    lastVerified: 'September 2025 (56th GST Council)',
    ambiguityQuestions: [
      {
        id: 'hotel_room_tariff',
        question: 'What is the declared daily room tariff per unit?',
        options: [
          { label: 'Up to ₹7,500 per unit per day (<= ₹7,500)', rate: 5, hsn: '9963', conditionNote: '5% GST applies since 22-09-2025 (GST 2.0)' },
          { label: 'Above ₹7,500 per unit per day (> ₹7,500)', rate: 18, hsn: '9963', conditionNote: '18% GST applies to luxury accommodation' }
        ]
      }
    ],
    historicalRates: [
      { effectiveDate: '2025-09-22', rate: 5, notificationNo: '09/2025-CT(Rate)', notes: 'GST 2.0: hotel rooms up to ₹7,500 moved from 12% to 5%' },
      { effectiveDate: '2019-09-01', rate: 12, notificationNo: '20/2019-CT(Rate)', notes: 'Rooms up to ₹7,500 taxed at 12% (above at 18%)' }
    ]
  },

  // Transportation & Logistics
  {
    code: '996511',
    type: 'SERVICES',
    category: 'Transportation & Logistics',
    subCategory: 'Goods Transport Agency (GTA)',
    description: 'Road transport of goods by Goods Transport Agency (GTA) with consignment note',
    keywords: ['transport', 'logistics', 'gta', 'freight', 'truck transport', 'lorry', 'goods transport'],
    gstRate: 5,
    applicableConditions: 'GTA services under Reverse Charge Mechanism (RCM) or without ITC attract 5%. GTA opting for forward charge with ITC attracts 12%.',
    source: 'CBIC Notification No. 11/2017-CT(Rate) as amended by 04/2022-CT(Rate)',
    lastVerified: 'September 2024'
  },
  {
    code: '996412',
    type: 'SERVICES',
    category: 'Transportation & Logistics',
    subCategory: 'Passenger Transport',
    description: 'Passenger transportation by road, air-conditioned bus, cab aggregator (Ola, Uber)',
    keywords: ['cab', 'taxi', 'ola', 'uber', 'ac bus', 'bus ticket', 'passenger transport'],
    gstRate: 5,
    applicableConditions: 'Transport of passengers by air-conditioned stage carriage or radio taxi attracts 5% GST without ITC.',
    source: 'CBIC Notification No. 11/2017-CT(Rate)',
    lastVerified: 'September 2024'
  },

  // Repair, Maintenance & Installation
  {
    code: '998719',
    type: 'SERVICES',
    category: 'Maintenance & Repair',
    subCategory: 'Repair of Machinery & Appliances',
    description: 'Maintenance, repair and installation services of electrical, electronic, and household appliances',
    keywords: ['repair', 'servicing', 'ac repair', 'laptop service', 'maintenance', 'installation', 'car service', 'amc'],
    gstRate: 18,
    applicableConditions: 'All general repair and maintenance services attract 18% GST under SAC 9987.',
    source: 'CBIC Notification No. 11/2017-CT(Rate)',
    lastVerified: 'September 2024'
  },

  // Legal & CA Services
  {
    code: '998211',
    type: 'SERVICES',
    category: 'Legal & Accounting',
    subCategory: 'Legal Services',
    description: 'Legal advisory and representation services by an advocate or firm of advocates',
    keywords: ['legal service', 'advocate fee', 'lawyer fee', 'legal consultation', 'court fee'],
    gstRate: 18,
    applicableConditions: 'Legal services provided by advocates/firms to business entities are taxable under Reverse Charge Mechanism (RCM) where recipient pays 18% GST.',
    source: 'CBIC Notification No. 13/2017-Central Tax (Rate) - Sl. No. 2',
    lastVerified: 'September 2024'
  }
];

/**
 * Fast client-side keyword and token matching engine for Indian products
 */
export function findBestGSTMatch(query: string): GSTItem | null {
  if (!query || !query.trim()) return null;

  const normalized = query.toLowerCase().trim();

  // 1. Direct code lookup if user typed 4 or 6 digit HSN/SAC
  const codeMatch = normalized.match(/\b(\d{4,8})\b/);
  if (codeMatch) {
    const item = GST_DATABASE.find(i => i.code.startsWith(codeMatch[1]) || codeMatch[1].startsWith(i.code));
    if (item) return item;
  }

  // 2. High priority keyword lookup
  let bestItem: GSTItem | null = null;
  let maxScore = 0;

  for (const item of GST_DATABASE) {
    let score = 0;
    
    // Exact keyword match
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length * 3; // longer match gives higher confidence
      }
    }

    // Category / description match
    if (normalized.includes(item.category.toLowerCase())) {
      score += 15;
    }
    if (item.subCategory && normalized.includes(item.subCategory.toLowerCase())) {
      score += 20;
    }

    // Specific Indian term checks
    if (normalized.includes('saree') && item.keywords.includes('saree')) score += 50;
    if (normalized.includes('tv') && item.keywords.includes('tv')) score += 50;
    if (normalized.includes('iphone') && item.keywords.includes('iphone')) score += 50;
    if (normalized.includes('laptop') && item.keywords.includes('laptop')) score += 50;
    if (normalized.includes('camera') && item.keywords.includes('camera rent')) score += 45;
    if (normalized.includes('restaurant') && item.keywords.includes('restaurant')) score += 50;
    if (normalized.includes('saas') && item.keywords.includes('saas')) score += 50;

    if (score > maxScore) {
      maxScore = score;
      bestItem = item;
    }
  }

  return maxScore >= 10 ? bestItem : null;
}
