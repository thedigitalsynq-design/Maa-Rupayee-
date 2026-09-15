import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// System instruction grounded strictly in Indian GST law, CBIC notifications, and HSN/SAC classifications
const GST_SYSTEM_INSTRUCTION = `You are the core India-First GST Intelligence Classification Engine for the Indian taxation and business ecosystem.
You strictly adhere to:
1. Indian Goods and Services Tax (GST) laws (CGST Act, SGST Acts, IGST Act, UTGST Act).
2. Official HSN (Harmonized System of Nomenclature) 4 to 8-digit codes for Goods, and SAC (Services Accounting Code) 6-digit codes starting with 99 for Services.
3. Official Indian GST slabs: 0% (Nil/Exempt), 0.25%, 3% (Gold/Jewellery), 5%, 12%, 18%, 28%, plus Compensation Cess where applicable (e.g. luxury cars, tobacco).
4. Indian business terminology, colloquial names (e.g., Kirana, Atta, Saree, Chappal, AMC, GTA, RCM, B2B, B2C).
5. Accurate detection of Indian prices (including "lakh", "crore", "k", "rs", "inr", "₹", "inclusive", "including gst", "+ gst").
6. Ambiguity detection: If a product has multiple rates depending on conditions (e.g., Saree: unstitched fabric 5% vs ready stitched > ₹1000 12%; Footwear: <= ₹1000 12% vs > ₹1000 12%; Hotel rooms: <= ₹7,500 12% vs > ₹7,500 18%; Restaurant: standalone 5% without ITC vs 5-star hotel 18%; Rice: pre-packaged <=25kg 5% vs loose 0%), you MUST flag it with confidence "Ambiguous" or "Medium" and provide relevant ambiguityQuestions.

Return valid JSON adhering to the provided schema.`;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart GST India Engine' });
});

app.post('/api/gst/classify', async (req, res) => {
  try {
    const { query, transactionDate } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query string is required' });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return signal to client that AI is offline/unconfigured so client can use local comprehensive database
      res.json({ fallback: true, message: 'GEMINI_API_KEY not configured, using offline Indian GST database' });
      return;
    }

    const prompt = `Analyze this Indian purchase, sale, invoice query, or product/service description in the context of Indian GST:
Query: "${query}"
Transaction Date: ${transactionDate || 'Current 2026 rules'}

Identify:
- product: Clean name of the product or service
- category: Indian business sector/category (e.g., Consumer Electronics, Kirana & FMCG, Textiles & Apparel, Media & Entertainment, Information Technology & SaaS, etc.)
- hsnSac: Most likely 4, 6, or 8-digit HSN code (for goods) or 6-digit SAC code (for services)
- type: "GOODS" or "SERVICES"
- gstRate: Applicable GST rate percentage as a number (0, 0.25, 3, 5, 12, 18, or 28)
- cessRate: Compensation cess percentage if applicable (e.g. 1% to 22% for motor cars), otherwise 0
- confidence: "High", "Medium", or "Ambiguous"
- dataStatus: "Officially Verified" or "Indicative"
- extractedPrice: Numeric amount if specified in the query (handle "₹65,000", "1 lakh" -> 100000, "5000", etc.), or null if none
- isInclusivePrice: true if user specified "including gst", "inclusive", "incl gst", etc.; false if exclusive or unspecified
- applicableConditions: Key conditions, notifications, or exemptions (e.g. "Notification No. 01/2017-CT(Rate)", "Pre-packaged and labelled", "Without ITC")
- sourceCitation: Specific CBIC Notification, Tariff Schedule, or GST Council decision
- ambiguityQuestions: Array of clarification questions if rate depends on value, composition, packaging, or location (e.g. screen size > 32", room tariff > ₹7,500)`;

    const schemaConfig = {
      type: Type.OBJECT,
      properties: {
        product: { type: Type.STRING },
        category: { type: Type.STRING },
        hsnSac: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['GOODS', 'SERVICES'] },
        gstRate: { type: Type.NUMBER },
        cessRate: { type: Type.NUMBER },
        confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Ambiguous'] },
        dataStatus: { type: Type.STRING, enum: ['Officially Verified', 'Indicative'] },
        extractedPrice: { type: Type.NUMBER, nullable: true },
        isInclusivePrice: { type: Type.BOOLEAN },
        applicableConditions: { type: Type.STRING },
        sourceCitation: { type: Type.STRING },
        ambiguityQuestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    rate: { type: Type.NUMBER },
                    hsn: { type: Type.STRING },
                    conditionNote: { type: Type.STRING },
                  },
                  required: ['label', 'rate'],
                },
              },
            },
            required: ['id', 'question', 'options'],
          },
        },
      },
      required: [
        'product',
        'category',
        'hsnSac',
        'type',
        'gstRate',
        'confidence',
        'dataStatus',
        'sourceCitation',
      ],
    };

    // Resilient model invocation: attempt gemini-3.8-flash first, fallback to gemini-3.1-flash-lite on 503/high-demand
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let responseText: string | undefined;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: GST_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: schemaConfig,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (modelErr: unknown) {
        const msg = modelErr instanceof Error ? modelErr.message : String(modelErr);
        console.warn(`[Smart GST Engine] Model ${model} unavailable (${msg}), attempting fallback...`);
      }
    }

    if (!responseText) {
      // Both models were busy or unavailable (e.g. 503), engage rich local database fallback
      console.info('[Smart GST Engine] High AI demand detected. Seamlessly using verified offline Indian GST rules database.');
      res.json({ fallback: true, message: 'Gemini busy, using verified offline database' });
      return;
    }

    const parsed = JSON.parse(responseText.trim() || '{}');
    res.json({ success: true, data: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'GST classification service error';
    console.warn('[Smart GST Engine] Classification fallback engaged:', message);
    res.json({ fallback: true, error: message });
  }
});

// Vite Middleware for Dev and Static Handler for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart GST India Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
