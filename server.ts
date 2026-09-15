import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import type { GSTCouncilStatus, GSTCouncilUpdate } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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
  res.json({ status: 'ok', service: 'Maa Rupayee Engine' });
});

app.post('/api/gst/classify', async (req, res) => {
  try {
    const { query, transactionDate } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query string is required' });
      return;
    }
    const safeQuery = query.slice(0, 500).replace(/"/g, "'");

    const ai = getGeminiClient();

    if (!ai) {
      // Return signal to client that AI is offline/unconfigured so client can use local comprehensive database
      res.json({ fallback: true, message: 'GEMINI_API_KEY not configured, using offline Indian GST database' });
      return;
    }

    const prompt = `Analyze this Indian purchase, sale, invoice query, or product/service description in the context of Indian GST:
Query: "${safeQuery}"
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
        console.warn(`[Maa Rupayee Engine] Model ${model} unavailable (${msg}), attempting fallback...`);
      }
    }

    if (!responseText) {
      // Both models were busy or unavailable (e.g. 503), engage rich local database fallback
      console.info('[Maa Rupayee Engine] High AI demand detected. Seamlessly using verified offline Indian GST rules database.');
      res.json({ fallback: true, message: 'Gemini busy, using verified offline database' });
      return;
    }

    const parsed = JSON.parse(responseText.trim() || '{}');
    res.json({ success: true, data: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'GST classification service error';
    console.warn('[Maa Rupayee Engine] Classification fallback engaged:', message);
    res.json({ fallback: true, error: message });
  }
});

// ============================================================================
// Government updates auto-sync: keeps Council/CBIC content fresh without a
// redeploy. A Gemini sweep runs every 12h (and on demand) and the validated
// overlay is cached on disk + served to clients via /api/gst/updates.
// The bundled static database always remains as the offline fallback.
// ============================================================================
const GOV_CACHE_FILE = path.join(process.cwd(), 'gov-updates.cache.json');
const GOV_REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12h scheduled sweep
const GOV_REFRESH_COOLDOWN_MS = 10 * 60 * 1000; // 10min between manual sweeps
const GOV_MAX_UPDATES = 50;

interface GovCache {
  updatedAt: string | null;
  updates: GSTCouncilUpdate[];
}

let govCache: GovCache = { updatedAt: null, updates: [] };
let govRefreshing = false;
let lastRefreshAttempt = 0;

function loadGovCache(): void {
  try {
    if (!fs.existsSync(GOV_CACHE_FILE)) return;
    const raw: unknown = JSON.parse(fs.readFileSync(GOV_CACHE_FILE, 'utf-8'));
    if (raw && typeof raw === 'object' && Array.isArray((raw as GovCache).updates)) {
      const parsed = raw as GovCache;
      govCache = {
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
        updates: parsed.updates.filter(isValidGovUpdate).slice(0, GOV_MAX_UPDATES),
      };
    }
  } catch (err) {
    console.warn('[GovSync] Could not load cache, starting empty:', err instanceof Error ? err.message : err);
  }
}

function saveGovCache(): void {
  try {
    fs.writeFileSync(GOV_CACHE_FILE, JSON.stringify(govCache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[GovSync] Could not persist cache:', err instanceof Error ? err.message : err);
  }
}

function isValidGovUpdate(u: unknown): u is GSTCouncilUpdate {
  if (!u || typeof u !== 'object') return false;
  const v = u as Record<string, unknown>;
  const requiredText = ['id', 'meeting', 'title', 'category', 'hsnSac', 'productName', 'oldRate', 'newRate', 'effectiveDate', 'impactSummary', 'officialSource', 'details'];
  if (!requiredText.every(k => typeof v[k] === 'string' && (v[k] as string).trim().length > 0)) return false;
  const statuses: GSTCouncilStatus[] = ['Recommended', 'Notified', 'Effective'];
  if (!statuses.includes(v['status'] as GSTCouncilStatus)) return false;
  return true;
}

async function refreshGovUpdates(reason: 'scheduled' | 'manual'): Promise<{ ok: boolean; added: number; updated: number; message: string }> {
  if (govRefreshing) {
    return { ok: false, added: 0, updated: 0, message: 'A government sync is already in progress' };
  }
  const ai = getGeminiClient();
  if (!ai) {
    return { ok: false, added: 0, updated: 0, message: 'GEMINI_API_KEY not configured, keeping verified static database' };
  }
  govRefreshing = true;
  lastRefreshAttempt = Date.now();
  try {
    const since = govCache.updatedAt ?? '2025-01-01';
    const knownIds = govCache.updates.map(u => u.id).slice(0, GOV_MAX_UPDATES).join(', ') || '(none yet)';
    const prompt = `You track official Indian GST government publications. List ONLY real, published GST Council decisions or CBIC gazette notifications dated after ${since} (today is ${new Date().toISOString().split('T')[0]}).
Rules:
- Every entry must be a genuine published Council decision or CBIC notification (meeting number + notification number where notified). NEVER invent entries. If nothing new was published, return an empty array [].
- Do not repeat these already-known entry ids (update them only if their status genuinely changed, e.g. Recommended -> Effective): ${knownIds.slice(0, 1500)}.
- appliedToCalculator must be true only when status is "Effective", otherwise false.
Return a JSON array (max 20 items) with objects: id (stable kebab-case, e.g. "gstc-56-health-insurance"), meeting, title, category, hsnSac, productName, oldRate, newRate, status ("Recommended" | "Notified" | "Effective"), notificationNo (or "Awaiting CBIC Notification"), notificationDate, effectiveDate, impactSummary (1-2 sentences), appliedToCalculator (boolean), officialSource (e.g. "PIB / GST Council Press Release" or "CBIC Notification No. ..."), details (one sentence on legal force).`;

    const updateSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        meeting: { type: Type.STRING },
        title: { type: Type.STRING },
        category: { type: Type.STRING },
        hsnSac: { type: Type.STRING },
        productName: { type: Type.STRING },
        oldRate: { type: Type.STRING },
        newRate: { type: Type.STRING },
        status: { type: Type.STRING, enum: ['Recommended', 'Notified', 'Effective'] },
        notificationNo: { type: Type.STRING },
        notificationDate: { type: Type.STRING },
        effectiveDate: { type: Type.STRING },
        impactSummary: { type: Type.STRING },
        appliedToCalculator: { type: Type.BOOLEAN },
        officialSource: { type: Type.STRING },
        details: { type: Type.STRING },
      },
      required: ['id', 'meeting', 'title', 'category', 'hsnSac', 'productName', 'oldRate', 'newRate', 'status', 'effectiveDate', 'impactSummary', 'officialSource', 'details'],
    };

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let responseText: string | undefined;
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: updateSchema } },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (modelErr: unknown) {
        console.warn(`[GovSync] Model ${model} unavailable (${modelErr instanceof Error ? modelErr.message : modelErr}), trying fallback...`);
      }
    }
    if (!responseText) {
      return { ok: false, added: 0, updated: 0, message: 'AI busy, kept existing government data' };
    }

    const parsed: unknown = JSON.parse(responseText.trim() || '[]');
    if (!Array.isArray(parsed)) {
      return { ok: false, added: 0, updated: 0, message: 'AI returned an unexpected shape, kept existing data' };
    }

    let added = 0;
    let updated = 0;
    for (const item of parsed.slice(0, 20)) {
      if (!isValidGovUpdate(item)) continue;
      const clean: GSTCouncilUpdate = {
        ...item,
        notificationNo: typeof item.notificationNo === 'string' ? item.notificationNo : 'Awaiting CBIC Notification',
        notificationDate: typeof item.notificationDate === 'string' ? item.notificationDate : undefined,
        appliedToCalculator: item.status === 'Effective' ? Boolean(item.appliedToCalculator) : false,
      };
      const idx = govCache.updates.findIndex(u => u.id === clean.id);
      if (idx >= 0) {
        govCache.updates[idx] = clean;
        updated += 1;
      } else {
        govCache.updates.push(clean);
        added += 1;
      }
    }
    govCache.updates = govCache.updates.slice(0, GOV_MAX_UPDATES);
    govCache.updatedAt = new Date().toISOString();
    saveGovCache();
    console.info(`[GovSync] ${reason} sweep: +${added} new, ~${updated} updated (checked ${new Date(govCache.updatedAt).toISOString()})`);
    return { ok: true, added, updated, message: added + updated === 0 ? 'Checked for new government notifications — already up to date' : `Synced ${added + updated} government update(s)` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Government sync failed';
    console.warn('[GovSync] Sweep failed, kept existing data:', message);
    return { ok: false, added: 0, updated: 0, message };
  } finally {
    govRefreshing = false;
  }
}

app.get('/api/gst/updates', (req, res) => {
  res.json({
    success: true,
    updatedAt: govCache.updatedAt,
    updates: govCache.updates,
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    refreshing: govRefreshing,
  });
});

app.post('/api/gst/updates/refresh', async (req, res) => {
  try {
    const force = req.body?.force === true;
    if (!force && Date.now() - lastRefreshAttempt < GOV_REFRESH_COOLDOWN_MS) {
      const retryAfter = Math.ceil((GOV_REFRESH_COOLDOWN_MS - (Date.now() - lastRefreshAttempt)) / 1000);
      res.status(429).json({ success: false, error: 'Sync ran recently, please retry shortly', retryAfter });
      return;
    }
    const result = await refreshGovUpdates('manual');
    res.json({ success: result.ok, ...result, updatedAt: govCache.updatedAt, updates: govCache.updates });
  } catch (err: unknown) {
    res.json({ success: false, error: err instanceof Error ? err.message : 'Refresh failed' });
  }
});

loadGovCache();
setInterval(() => {
  refreshGovUpdates('scheduled').catch(err => console.warn('[GovSync] Scheduled sweep error:', err));
}, GOV_REFRESH_INTERVAL_MS);

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
    console.log(`Maa Rupayee Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
