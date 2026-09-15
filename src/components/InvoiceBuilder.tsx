import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Layers,
  Truck,
  CreditCard,
  Check,
  FileText,
  Loader2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceLineItem, IndianState } from '../types';
import { INDIAN_STATES, DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from '../data/indianStates';
import { formatIndianCurrency, amountInIndianWords } from '../utils/indianCurrency';

interface HsnSummaryRow {
  hsnSac: string;
  rate: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  utgst: number;
}

interface InvoiceBuilderProps {
  items: InvoiceLineItem[];
  setItems: React.Dispatch<React.SetStateAction<InvoiceLineItem[]>>;
  supplierState: IndianState;
  setSupplierState: (s: IndianState) => void;
  customerState: IndianState;
  setCustomerState: (s: IndianState) => void;
}

export const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({
  items,
  setItems,
  supplierState,
  setSupplierState,
  customerState,
  setCustomerState,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Invoice Header Information
  const [invoiceType, setInvoiceType] = useState<'B2B' | 'B2C'>('B2B');
  const [invoiceCopy, setInvoiceCopy] = useState<'Original for Recipient' | 'Duplicate for Transporter' | 'Triplicate for Supplier'>('Original for Recipient');
  const [invoiceNo, setInvoiceNo] = useState(`INV/2026-27/${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [reverseCharge, setReverseCharge] = useState<'No' | 'Yes'>('No');
  const [ewayBillNo, setEwayBillNo] = useState('2410 8921 4452');
  const [vehicleNo, setVehicleNo] = useState('MH-02-CD-5412');

  // Supplier Details
  const [supplierName, setSupplierName] = useState('Apex Enterprise Solutions Pvt Ltd');
  const [supplierAddress, setSupplierAddress] = useState('Tower B, 4th Floor, Tech Park, Andheri East, Mumbai, Maharashtra - 400069');
  const [supplierGstin, setSupplierGstin] = useState(`${supplierState.tin}AABCA1234F1Z9`);
  const [supplierPan, setSupplierPan] = useState('AABCA1234F');
  const [supplierEmail, setSupplierEmail] = useState('billing@apexsolutions.in');

  // Customer / Recipient Details
  const [customerName, setCustomerName] = useState('Zenith Infra Systems Ltd');
  const [customerAddress, setCustomerAddress] = useState('Plot 42, Electronic City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100');
  const [customerGstin, setCustomerGstin] = useState(`${customerState.tin}AABCZ5678K1Z3`);
  const [customerPan, setCustomerPan] = useState('AABCZ5678K');

  // Banking Details
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNo, setAccountNo] = useState('5020 0054 8812 34');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');
  const [upiId, setUpiId] = useState('apexsolutions@hdfcbank');

  // Item Form State
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemHsn, setNewItemHsn] = useState('8528');
  const [newItemType, setNewItemType] = useState<'GOODS' | 'SERVICES'>('GOODS');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('NOS');
  const [newItemPrice, setNewItemPrice] = useState(25000);
  const [newItemDiscount, setNewItemDiscount] = useState(0);
  const [newItemGstRate, setNewItemGstRate] = useState(18);

  const safeSupplierState = supplierState || DEFAULT_SUPPLIER_STATE;
  const safeCustomerState = customerState || DEFAULT_CUSTOMER_STATE;

  const isIntraState = safeSupplierState.code === safeCustomerState.code;
  const isUTWithoutLeg = isIntraState && Boolean(safeSupplierState.isUT) && !safeSupplierState.hasLegislature;

  // Preset Scenario Loader
  const loadPresetScenario = (scenario: 'b2b-inter' | 'b2b-intra' | 'b2c-retail' | 'saas-services') => {
    const mh = INDIAN_STATES.find(s => s.code === 'MH' || s.tin === '27') || safeSupplierState;
    const ka = INDIAN_STATES.find(s => s.code === 'KA' || s.tin === '29') || safeCustomerState;
    const dl = INDIAN_STATES.find(s => s.code === 'DL' || s.tin === '07') || safeCustomerState;

    if (scenario === 'b2b-inter') {
      setSupplierState(mh);
      setCustomerState(ka);
      setSupplierGstin('27AABCA1234F1Z9');
      setCustomerGstin('29AABCZ5678K1Z3');
      setCustomerName('Zenith Infra Systems Ltd');
      setCustomerAddress('Plot 42, Electronic City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100');
      setInvoiceType('B2B');
      setItems([
        {
          id: 'item-1',
          description: 'Samsung 55 Inch Ultra HD 4K Commercial Display Panel',
          hsnSac: '8528',
          type: 'GOODS',
          quantity: 2,
          unit: 'NOS',
          unitPrice: 65000,
          discountPercent: 5,
          gstRate: 28,
          cessRate: 0,
          taxableAmount: 123500,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 34580,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 158080,
        },
        {
          id: 'item-2',
          description: 'Wall Mounting Bracket & High-Speed Optical Cable Set',
          hsnSac: '8544',
          type: 'GOODS',
          quantity: 2,
          unit: 'SET',
          unitPrice: 3500,
          discountPercent: 0,
          gstRate: 18,
          cessRate: 0,
          taxableAmount: 7000,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 1260,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 8260,
        },
        {
          id: 'item-3',
          description: 'Onsite Installation, Calibration & Testing Services',
          hsnSac: '9987',
          type: 'SERVICES',
          quantity: 1,
          unit: 'SRV',
          unitPrice: 8500,
          discountPercent: 0,
          gstRate: 18,
          cessRate: 0,
          taxableAmount: 8500,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 1530,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 10030,
        },
      ]);
    } else if (scenario === 'b2b-intra') {
      setSupplierState(mh);
      setCustomerState(mh);
      setSupplierGstin('27AABCA1234F1Z9');
      setCustomerGstin('27BBBBB1111B1Z5');
      setCustomerName('Maharashtra Industrial Traders LLP');
      setCustomerAddress('Gala 14, MIDC Industrial Area, Pune, Maharashtra - 411018');
      setInvoiceType('B2B');
      setItems([
        {
          id: 'item-1',
          description: 'Industrial Safety Footwear - Heavy Duty Steel Toe',
          hsnSac: '6403',
          type: 'GOODS',
          quantity: 50,
          unit: 'PRS',
          unitPrice: 1400,
          discountPercent: 2,
          gstRate: 12,
          cessRate: 0,
          taxableAmount: 68600,
          cgstAmount: 4116,
          sgstAmount: 4116,
          igstAmount: 0,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 76832,
        },
        {
          id: 'item-2',
          description: 'Protective Cotton Workwear Uniforms',
          hsnSac: '6203',
          type: 'GOODS',
          quantity: 50,
          unit: 'SET',
          unitPrice: 850,
          discountPercent: 0,
          gstRate: 5,
          cessRate: 0,
          taxableAmount: 42500,
          cgstAmount: 1062.5,
          sgstAmount: 1062.5,
          igstAmount: 0,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 44625,
        }
      ]);
    } else if (scenario === 'saas-services') {
      setSupplierState(ka);
      setCustomerState(dl);
      setSupplierGstin('29AABCA1234F1Z9');
      setCustomerGstin('07DDDDD2222D1Z8');
      setCustomerName('National Media & Tech Corp');
      setCustomerAddress('Barakhamba Road, Connaught Place, New Delhi - 110001');
      setInvoiceType('B2B');
      setItems([
        {
          id: 'item-1',
          description: 'Enterprise Cloud ERP Platform Annual Subscription (50 Users)',
          hsnSac: '998314',
          type: 'SERVICES',
          quantity: 1,
          unit: 'YR',
          unitPrice: 240000,
          discountPercent: 10,
          gstRate: 18,
          cessRate: 0,
          taxableAmount: 216000,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 38880,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 254880,
        },
        {
          id: 'item-2',
          description: 'Custom API Integration & Security Audit SLA',
          hsnSac: '998313',
          type: 'SERVICES',
          quantity: 20,
          unit: 'HRS',
          unitPrice: 2500,
          discountPercent: 0,
          gstRate: 18,
          cessRate: 0,
          taxableAmount: 50000,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 9000,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 59000,
        }
      ]);
    } else {
      // B2C Retail
      setSupplierState(mh);
      setCustomerState(mh);
      setInvoiceType('B2C');
      setCustomerName('Rahul Sharma (Walk-in Customer)');
      setCustomerAddress('Bandra West, Mumbai - 400050');
      setCustomerGstin('Unregistered');
      setItems([
        {
          id: 'item-1',
          description: 'Apple iPhone 16 Pro 256GB - Desert Titanium',
          hsnSac: '8517',
          type: 'GOODS',
          quantity: 1,
          unit: 'NOS',
          unitPrice: 119900,
          discountPercent: 3,
          gstRate: 18,
          cessRate: 0,
          taxableAmount: 116303,
          cgstAmount: 10467.27,
          sgstAmount: 10467.27,
          igstAmount: 0,
          utgstAmount: 0,
          cessAmount: 0,
          totalAmount: 137237.54,
        }
      ]);
    }
  };

  // Add line item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDesc.trim()) return;

    const rawTotal = newItemQty * newItemPrice;
    const discountAmount = rawTotal * (newItemDiscount / 100);
    const taxable = rawTotal - discountAmount;
    const gstAmount = taxable * (newItemGstRate / 100);

    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let utgst = 0;

    if (!isIntraState) {
      igst = gstAmount;
    } else if (isUTWithoutLeg) {
      cgst = gstAmount / 2;
      utgst = gstAmount / 2;
    } else {
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
    }

    const item: InvoiceLineItem = {
      id: `item-${Date.now()}`,
      description: newItemDesc,
      hsnSac: newItemHsn,
      type: newItemType,
      quantity: newItemQty,
      unit: newItemUnit,
      unitPrice: newItemPrice,
      discountPercent: newItemDiscount,
      gstRate: newItemGstRate,
      cessRate: 0,
      taxableAmount: Number(taxable.toFixed(2)),
      cgstAmount: Number(cgst.toFixed(2)),
      sgstAmount: Number(sgst.toFixed(2)),
      igstAmount: Number(igst.toFixed(2)),
      utgstAmount: Number(utgst.toFixed(2)),
      cessAmount: 0,
      totalAmount: Number((taxable + gstAmount).toFixed(2)),
    };

    setItems([...items, item]);
    setNewItemDesc('');
    setNewItemPrice(5000);
  };

  // Update line item quantity or unit price directly
  const handleUpdateItemQty = (id: string, newQty: number) => {
    if (newQty <= 0) return;
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const rawTotal = newQty * item.unitPrice;
      const discountAmount = rawTotal * (item.discountPercent / 100);
      const taxable = rawTotal - discountAmount;
      const gstAmount = taxable * (item.gstRate / 100);

      let cgst = 0, sgst = 0, igst = 0, utgst = 0;
      if (!isIntraState) {
        igst = gstAmount;
      } else if (isUTWithoutLeg) {
        cgst = gstAmount / 2;
        utgst = gstAmount / 2;
      } else {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
      }

      return {
        ...item,
        quantity: newQty,
        taxableAmount: Number(taxable.toFixed(2)),
        cgstAmount: Number(cgst.toFixed(2)),
        sgstAmount: Number(sgst.toFixed(2)),
        igstAmount: Number(igst.toFixed(2)),
        utgstAmount: Number(utgst.toFixed(2)),
        totalAmount: Number((taxable + gstAmount).toFixed(2)),
      };
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  // Totals calculations
  const totalTaxable = items.reduce((acc, i) => acc + i.taxableAmount, 0);
  const totalCgst = items.reduce((acc, i) => acc + i.cgstAmount, 0);
  const totalSgst = items.reduce((acc, i) => acc + i.sgstAmount, 0);
  const totalUtgst = items.reduce((acc, i) => acc + i.utgstAmount, 0);
  const totalIgst = items.reduce((acc, i) => acc + i.igstAmount, 0);
  const totalGst = totalCgst + totalSgst + totalUtgst + totalIgst;
  const grandTotal = totalTaxable + totalGst;
  const roundedGrandTotal = Math.round(grandTotal);
  const roundOff = Number((roundedGrandTotal - grandTotal).toFixed(2));

  // HSN summary grouping
  const hsnSummary = items.reduce((acc, item) => {
    const key = `${item.hsnSac}-${item.gstRate}`;
    if (!acc[key]) {
      acc[key] = {
        hsnSac: item.hsnSac,
        rate: item.gstRate,
        taxable: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        utgst: 0,
      };
    }
    acc[key].taxable += item.taxableAmount;
    acc[key].cgst += item.cgstAmount;
    acc[key].sgst += item.sgstAmount;
    acc[key].igst += item.igstAmount;
    acc[key].utgst += item.utgstAmount;
    return acc;
  }, {} as Record<string, HsnSummaryRow>);

  // Generate & Download PDF
  const handleGeneratePdf = async () => {
    if (!invoiceRef.current || isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);

      // Create high-res canvas from the invoice element
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Multi-page support if invoice has lots of items
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const sanitizedInvoiceNo = invoiceNo.replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${sanitizedInvoiceNo}_Tax_Invoice.pdf`;

      // Save PDF directly
      pdf.save(fileName);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback to browser print if canvas fails
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6">
      {/* Top Controls & Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-white">Tax Invoice Studio</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-zinc-300 border border-white/20">
              Rule 46 CGST Act
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compliant Indian GST Tax Invoice with statutory HSN tax matrix and real-time PDF generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Scenario Buttons */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs font-semibold text-zinc-300">
            <span className="text-[10px] text-zinc-400 px-1.5 font-medium">Presets:</span>
            <button
              onClick={() => loadPresetScenario('b2b-inter')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white hover:text-black rounded-lg text-zinc-200 text-xs font-medium transition-all cursor-pointer"
            >
              B2B IGST
            </button>
            <button
              onClick={() => loadPresetScenario('b2b-intra')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white hover:text-black rounded-lg text-zinc-200 text-xs font-medium transition-all cursor-pointer"
            >
              B2B CGST+SGST
            </button>
            <button
              onClick={() => loadPresetScenario('saas-services')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white hover:text-black rounded-lg text-zinc-200 text-xs font-medium transition-all cursor-pointer"
            >
              IT / SaaS
            </button>
            <button
              onClick={() => loadPresetScenario('b2c-retail')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white hover:text-black rounded-lg text-zinc-200 text-xs font-medium transition-all cursor-pointer"
            >
              B2C Retail
            </button>
          </div>

          {/* Generate PDF Button (Pure Monochrome) */}
          <button
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border ${
              pdfSuccess
                ? 'bg-zinc-800 text-white border-zinc-600'
                : 'bg-white text-zinc-950 hover:bg-zinc-100 border-white disabled:opacity-50'
            }`}
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                <span>Generating PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-zinc-950" />
                <span>Generate PDF</span>
              </>
            )}
          </button>

          {/* Print Invoice Button (Triggers clean native invoice printing) */}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-white/15 shadow-sm transition-all cursor-pointer"
            title="Print only this invoice sheet"
          >
            <Printer className="h-4 w-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* The Printable / PDF Rendered Invoice Container */}
      <div 
        id="printable-tax-invoice"
        ref={invoiceRef}
        className="bg-white rounded-2xl shadow-2xl border border-zinc-300 overflow-hidden text-zinc-950 print:shadow-none print:border print:border-zinc-400 print:m-0 print:p-0"
      >
        {/* Invoice Top Header Banner */}
        <div className="p-6 border-b border-zinc-300">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {/* Supplier Brand & Address */}
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-sm font-mono shadow-xs">
                  ₹
                </div>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="font-bold text-lg text-zinc-950 w-full border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none bg-transparent"
                />
              </div>
              <textarea
                value={supplierAddress}
                onChange={(e) => setSupplierAddress(e.target.value)}
                rows={2}
                className="text-xs text-zinc-600 w-full border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none resize-none bg-transparent"
              />
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-zinc-700 font-mono">
                <div>
                  <span className="text-zinc-500 font-sans font-medium">GSTIN:</span>{' '}
                  <input
                    type="text"
                    value={supplierGstin}
                    onChange={(e) => setSupplierGstin(e.target.value.toUpperCase())}
                    className="font-bold text-zinc-950 border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none w-36 bg-transparent"
                  />
                </div>
                <div>
                  <span className="text-zinc-500 font-sans font-medium">PAN:</span>{' '}
                  <input
                    type="text"
                    value={supplierPan}
                    onChange={(e) => setSupplierPan(e.target.value.toUpperCase())}
                    className="font-bold text-zinc-950 border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none w-28 bg-transparent"
                  />
                </div>
                <div>
                  <span className="text-zinc-500 font-sans font-medium">State:</span>{' '}
                  <strong className="text-zinc-950">{supplierState.name} (Code: {supplierState.tin})</strong>
                </div>
                <div>
                  <span className="text-zinc-500 font-sans font-medium">Email:</span>{' '}
                  <input
                    type="text"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    className="text-zinc-800 border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none w-36 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Document Title & Invoice Meta */}
            <div className="text-right">
              <div className="inline-block border-2 border-zinc-900 px-3 py-1 text-zinc-950 font-black text-sm tracking-wider uppercase bg-zinc-100 mb-2">
                TAX INVOICE
              </div>
              
              {/* Copy Selector */}
              <div className="text-xs font-semibold text-zinc-500 mb-2">
                <select
                  aria-label="Invoice Copy Type"
                  value={invoiceCopy}
                  onChange={(e) => setInvoiceCopy(e.target.value as any)}
                  className="bg-white border border-zinc-300 rounded px-2 py-0.5 text-xs text-zinc-800 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Original for Recipient">Original for Recipient</option>
                  <option value="Duplicate for Transporter">Duplicate for Transporter</option>
                  <option value="Triplicate for Supplier">Triplicate for Supplier</option>
                </select>
              </div>

              <div className="space-y-1 text-xs text-zinc-800">
                <div>
                  <span className="text-zinc-500">Invoice No:</span>{' '}
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="font-mono font-bold text-zinc-950 text-right border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none w-36 bg-transparent"
                  />
                </div>
                <div>
                  <span className="text-zinc-500">Invoice Date:</span>{' '}
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="font-mono font-bold text-zinc-950 text-right border-b border-transparent hover:border-zinc-300 focus:outline-none bg-transparent"
                  />
                </div>
                <div>
                  <span className="text-zinc-500">Due Date:</span>{' '}
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="font-mono text-zinc-700 text-right border-b border-transparent hover:border-zinc-300 focus:outline-none bg-transparent"
                  />
                </div>
                <div>
                  <span className="text-zinc-500">Place of Supply:</span>{' '}
                  <strong className="text-zinc-950">{customerState.name} ({customerState.tin})</strong>
                </div>
                <div>
                  <span className="text-zinc-500">Reverse Charge (RCM):</span>{' '}
                  <select
                    aria-label="Reverse Charge Mechanism Applicable"
                    value={reverseCharge}
                    onChange={(e) => setReverseCharge(e.target.value as any)}
                    className="bg-transparent font-bold text-zinc-900 border-b border-transparent hover:border-zinc-300 focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To Two-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-zinc-300 text-xs bg-zinc-50/70">
          {/* Details of Receiver (Billed To) */}
          <div className="p-5">
            <div className="font-bold text-zinc-700 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
              <span>Details of Recipient (Billed To)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                invoiceType === 'B2B' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-800'
              }`}>
                {invoiceType} Supply
              </span>
            </div>
            
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="font-bold text-sm text-zinc-950 w-full border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none mb-1 bg-transparent"
            />
            <textarea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              rows={2}
              className="text-xs text-zinc-600 w-full border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none resize-none mb-2 bg-transparent"
            />

            <div className="space-y-1 font-mono text-zinc-800">
              <div>
                <span className="text-zinc-500 font-sans font-medium">GSTIN:</span>{' '}
                <input
                  type="text"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                  className="font-bold text-zinc-950 border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none w-40 bg-transparent"
                />
              </div>
              <div>
                <span className="text-zinc-500 font-sans font-medium">PAN:</span>{' '}
                <input
                  type="text"
                  value={customerPan}
                  onChange={(e) => setCustomerPan(e.target.value.toUpperCase())}
                  className="text-zinc-800 border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none w-32 bg-transparent"
                />
              </div>
              <div>
                <span className="text-zinc-500 font-sans font-medium">State & Code:</span>{' '}
                <strong className="text-zinc-950">{customerState.name} (Code: {customerState.tin})</strong>
              </div>
            </div>
          </div>

          {/* Consignee / Transport Logistics Details */}
          <div className="p-5">
            <div className="font-bold text-zinc-700 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
              <span>Dispatch & Transport Details</span>
              <Truck className="h-3.5 w-3.5 text-zinc-500" />
            </div>

            <div className="space-y-2 text-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-sans font-medium">E-Way Bill No:</span>
                <input
                  type="text"
                  value={ewayBillNo}
                  onChange={(e) => setEwayBillNo(e.target.value)}
                  placeholder="e.g. 2410 8921 4452"
                  className="font-mono font-semibold text-zinc-950 text-right border-b border-transparent hover:border-zinc-300 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-sans font-medium">Vehicle / Transport No:</span>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                  placeholder="e.g. MH-02-CD-5412"
                  className="font-mono font-semibold text-zinc-950 text-right border-b border-transparent hover:border-zinc-300 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-sans font-medium">Transaction Nature:</span>
                <span className="font-bold px-2.5 py-0.5 rounded text-[11px] bg-zinc-100 text-zinc-900 border border-zinc-300">
                  {isIntraState ? 'Intra-State Supply (CGST + SGST)' : 'Inter-State Supply (IGST)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-500 pt-1">
                <span>Consignee Shipping Address:</span>
                <span className="italic">Same as Billed To</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Line Item Bar (Clean, Hidden on Print) */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-300 print:hidden">
          <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs items-end">
            <div className="sm:col-span-4">
              <label className="block text-zinc-700 font-bold mb-1">Item Description</label>
              <input
                type="text"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                placeholder="Product or service description"
                className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-700 font-bold mb-1">HSN/SAC</label>
              <input
                type="text"
                value={newItemHsn}
                onChange={(e) => setNewItemHsn(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded font-mono text-zinc-950 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-zinc-700 font-bold mb-1">Qty</label>
              <input
                type="number"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded font-mono text-center text-zinc-950 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-zinc-700 font-bold mb-1">Unit</label>
              <select
                aria-label="Unit of Measurement"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="w-full px-1 py-1.5 bg-white border border-zinc-300 rounded text-xs text-zinc-950 focus:outline-none cursor-pointer"
              >
                <option value="NOS">NOS</option>
                <option value="PCS">PCS</option>
                <option value="KGS">KGS</option>
                <option value="SET">SET</option>
                <option value="BOX">BOX</option>
                <option value="MTR">MTR</option>
                <option value="HRS">HRS</option>
                <option value="SRV">SRV</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-700 font-bold mb-1">Rate / Unit (₹)</label>
              <input
                type="number"
                min="0"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded font-mono text-zinc-950 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-zinc-700 font-bold mb-1">GST %</label>
              <select
                aria-label="GST Rate Slab"
                value={newItemGstRate}
                onChange={(e) => setNewItemGstRate(Number(e.target.value))}
                className="w-full px-1 py-1.5 bg-white border border-zinc-300 rounded font-bold text-zinc-950 focus:outline-none cursor-pointer"
              >
                <option value={0}>0%</option>
                <option value={3}>3%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                className="w-full py-1.5 bg-zinc-900 hover:bg-black text-white font-bold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Primary Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-100 text-zinc-900 font-bold border-b border-zinc-300">
                <th className="py-2.5 px-3 w-8 text-center border-r border-zinc-300">#</th>
                <th className="py-2.5 px-3 border-r border-zinc-300">Item Description</th>
                <th className="py-2.5 px-3 border-r border-zinc-300 font-mono">HSN/SAC</th>
                <th className="py-2.5 px-3 text-center border-r border-zinc-300">Qty</th>
                <th className="py-2.5 px-3 text-right border-r border-zinc-300">Rate (₹)</th>
                <th className="py-2.5 px-3 text-right border-r border-zinc-300">Taxable (₹)</th>
                <th className="py-2.5 px-3 text-center border-r border-zinc-300">GST %</th>
                {isIntraState ? (
                  <>
                    <th className="py-2.5 px-3 text-right border-r border-zinc-300">CGST (₹)</th>
                    <th className="py-2.5 px-3 text-right border-r border-zinc-300">
                      {isUTWithoutLeg ? 'UTGST (₹)' : 'SGST (₹)'}
                    </th>
                  </>
                ) : (
                  <th className="py-2.5 px-3 text-right border-r border-zinc-300">IGST (₹)</th>
                )}
                <th className="py-2.5 px-3 text-right">Total (₹)</th>
                <th className="py-2.5 px-2 text-center print:hidden w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={isIntraState ? 11 : 10} className="py-8 text-center text-zinc-500 italic">
                    No items in invoice. Use the form above or pick a preset template.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/80">
                    <td className="py-2.5 px-3 text-center text-zinc-500 font-mono border-r border-zinc-200">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-zinc-950 border-r border-zinc-200">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700 border-r border-zinc-200">
                      {item.hsnSac}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-zinc-200">
                      <span className="print:inline hidden">{item.quantity} {item.unit}</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQty(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 text-center bg-transparent border border-transparent hover:border-zinc-300 focus:border-zinc-900 rounded print:hidden font-mono text-zinc-950"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono border-r border-zinc-200 text-zinc-800">
                      {formatIndianCurrency(item.unitPrice, false)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold border-r border-zinc-200 text-zinc-950">
                      {formatIndianCurrency(item.taxableAmount, false)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-zinc-900 border-r border-zinc-200">
                      {item.gstRate}%
                    </td>
                    {isIntraState ? (
                      <>
                        <td className="py-2.5 px-3 text-right font-mono text-zinc-700 border-r border-zinc-200">
                          {formatIndianCurrency(item.cgstAmount, false)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-zinc-700 border-r border-zinc-200">
                          {formatIndianCurrency(item.sgstAmount || item.utgstAmount, false)}
                        </td>
                      </>
                    ) : (
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-700 border-r border-zinc-200">
                        {formatIndianCurrency(item.igstAmount, false)}
                      </td>
                    )}
                    <td className="py-2.5 px-3 text-right font-mono font-black text-zinc-950">
                      {formatIndianCurrency(item.totalAmount, false)}
                    </td>
                    <td className="py-2.5 px-2 text-center print:hidden">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-zinc-400 hover:text-black p-1 cursor-pointer transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Statutory HSN / SAC Summary Table (Mandatory for Indian GST) */}
        {Object.keys(hsnSummary).length > 0 && (
          <div className="border-t border-zinc-300 bg-zinc-50/70 p-4">
            <div className="text-[11px] font-bold text-zinc-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-zinc-600" />
              <span>Tax Summary by HSN / SAC (Statutory Indian Format)</span>
            </div>
            
            <table className="w-full text-left text-[11px] border border-zinc-300 bg-white">
              <thead className="bg-zinc-100 text-zinc-900 font-bold border-b border-zinc-300">
                <tr>
                  <th className="py-1.5 px-2.5 border-r border-zinc-300">HSN/SAC</th>
                  <th className="py-1.5 px-2.5 text-right border-r border-zinc-300">Taxable Value</th>
                  <th className="py-1.5 px-2.5 text-center border-r border-zinc-300">Rate</th>
                  {isIntraState ? (
                    <>
                      <th className="py-1.5 px-2.5 text-right border-r border-zinc-300">CGST Amount</th>
                      <th className="py-1.5 px-2.5 text-right border-r border-zinc-300">
                        {isUTWithoutLeg ? 'UTGST Amount' : 'SGST Amount'}
                      </th>
                    </>
                  ) : (
                    <th className="py-1.5 px-2.5 text-right border-r border-zinc-300">IGST Amount</th>
                  )}
                  <th className="py-1.5 px-2.5 text-right">Total Tax Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {(Object.values(hsnSummary) as HsnSummaryRow[]).map((sum, i) => (
                  <tr key={i}>
                    <td className="py-1.5 px-2.5 font-mono font-semibold border-r border-zinc-200 text-zinc-950">{sum.hsnSac}</td>
                    <td className="py-1.5 px-2.5 text-right font-mono border-r border-zinc-200 text-zinc-900">{formatIndianCurrency(sum.taxable)}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold border-r border-zinc-200 text-zinc-950">{sum.rate}%</td>
                    {isIntraState ? (
                      <>
                        <td className="py-1.5 px-2.5 text-right font-mono border-r border-zinc-200 text-zinc-800">{formatIndianCurrency(sum.cgst)}</td>
                        <td className="py-1.5 px-2.5 text-right font-mono border-r border-zinc-200 text-zinc-800">{formatIndianCurrency(sum.sgst || sum.utgst)}</td>
                      </>
                    ) : (
                      <td className="py-1.5 px-2.5 text-right font-mono border-r border-zinc-200 text-zinc-800">{formatIndianCurrency(sum.igst)}</td>
                    )}
                    <td className="py-1.5 px-2.5 text-right font-mono font-black text-zinc-950">
                      {formatIndianCurrency(sum.cgst + sum.sgst + sum.utgst + sum.igst)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invoice Summary & Bank Details Section */}
        <div className="border-t border-zinc-300 p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Bank Details & Amount in Words */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                  Invoice Value in Words:
                </span>
                <div className="text-xs font-bold text-zinc-950 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 font-sans italic">
                  {amountInIndianWords(roundedGrandTotal)}
                </div>
              </div>

              {/* Bank Account for NEFT/RTGS/UPI */}
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs">
                <div className="font-bold text-zinc-900 text-[11px] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-zinc-700" />
                  <span>Bank & Remittance Details</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-zinc-700 font-mono">
                  <div>
                    <span className="text-zinc-500 font-sans">Bank:</span>{' '}
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="font-bold text-zinc-950 border-b border-transparent hover:border-zinc-300 focus:outline-none w-32 bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-zinc-500 font-sans">A/C No:</span>{' '}
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="font-bold text-zinc-950 border-b border-transparent hover:border-zinc-300 focus:outline-none w-36 bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-zinc-500 font-sans">IFSC:</span>{' '}
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      className="font-bold text-zinc-950 border-b border-transparent hover:border-zinc-300 focus:outline-none w-28 bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="text-zinc-500 font-sans">UPI ID:</span>{' '}
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="font-bold text-zinc-950 border-b border-transparent hover:border-zinc-300 focus:outline-none w-36 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Standard Terms & Conditions */}
              <div className="text-[10px] text-zinc-500 space-y-0.5 leading-relaxed">
                <strong className="text-zinc-800 block font-semibold">Terms & Conditions:</strong>
                <div>1. Payment due within specified period. Interest @ 18% p.a. chargeable on delayed remittances.</div>
                <div>2. Goods once sold will not be accepted back or exchanged under any circumstances.</div>
                <div>3. All disputes subject to jurisdiction of Courts in Mumbai, Maharashtra.</div>
              </div>
            </div>

            {/* Right: Detailed Financial Computation Matrix */}
            <div className="md:col-span-5 bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-700">
                <span>Total Taxable Amount:</span>
                <span className="font-mono font-bold text-zinc-950">{formatIndianCurrency(totalTaxable)}</span>
              </div>

              {isIntraState ? (
                <>
                  <div className="flex justify-between text-zinc-600">
                    <span>Central Tax (CGST):</span>
                    <span className="font-mono text-zinc-800">{formatIndianCurrency(totalCgst)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>{isUTWithoutLeg ? 'Union Territory Tax (UTGST):' : 'State Tax (SGST):'}</span>
                    <span className="font-mono text-zinc-800">{formatIndianCurrency(totalSgst || totalUtgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-zinc-600">
                  <span>Integrated Tax (IGST):</span>
                  <span className="font-mono text-zinc-800">{formatIndianCurrency(totalIgst)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-900 font-semibold pt-1 border-t border-zinc-200">
                <span>Total Tax (GST):</span>
                <span className="font-mono text-zinc-950">{formatIndianCurrency(totalGst)}</span>
              </div>

              {roundOff !== 0 && (
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>Round Off (+/-):</span>
                  <span className="font-mono">{roundOff > 0 ? `+${roundOff}` : roundOff}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t-2 border-zinc-300">
                <span>Total Invoice Value:</span>
                <span className="font-mono text-zinc-950">{formatIndianCurrency(roundedGrandTotal)}</span>
              </div>

              {/* Authorized Signatory Box */}
              <div className="pt-6 mt-4 border-t border-zinc-200 text-center">
                <div className="text-[11px] font-semibold text-zinc-900 mb-8">
                  For <strong>{supplierName}</strong>
                </div>
                <div className="border-t border-dashed border-zinc-400 pt-1 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
