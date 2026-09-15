import type { GSTCouncilUpdate } from '../types';

// Client-side government sync: pulls the server's auto-synced Council/CBIC
// overlay (refreshed on the server every 12h + on demand) and caches it
// locally so the feed and classifier stay fresh between visits.
export interface GovSyncState {
  updatedAt: string | null;
  updates: GSTCouncilUpdate[];
}

const STORAGE_KEY = 'smart_gst_gov_updates';
const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // re-check if older than 24h

function isPlausibleUpdate(u: unknown): u is GSTCouncilUpdate {
  if (!u || typeof u !== 'object') return false;
  const v = u as Record<string, unknown>;
  return typeof v['id'] === 'string' && (v['id'] as string).length > 0
    && typeof v['title'] === 'string'
    && typeof v['status'] === 'string';
}

export function readGovSyncSnapshot(): GovSyncState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { updatedAt: null, updates: [] };
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return { updatedAt: null, updates: [] };
    const state = parsed as GovSyncState;
    return {
      updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : null,
      updates: Array.isArray(state.updates) ? state.updates.filter(isPlausibleUpdate) : [],
    };
  } catch {
    return { updatedAt: null, updates: [] };
  }
}

function persistSnapshot(state: GovSyncState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage quota / private mode — in-memory use continues
  }
}

export function isGovSyncStale(updatedAt: string | null): boolean {
  if (!updatedAt) return true;
  const ts = Date.parse(updatedAt);
  if (Number.isNaN(ts)) return true;
  return Date.now() - ts > STALE_AFTER_MS;
}

export async function fetchGovSyncState(): Promise<GovSyncState> {
  const res = await fetch('/api/gst/updates');
  if (!res.ok) throw new Error(`Sync check failed (${res.status})`);
  const data: unknown = await res.json();
  if (!data || typeof data !== 'object') throw new Error('Unexpected sync response');
  const payload = data as { updatedAt?: unknown; updates?: unknown };
  const state: GovSyncState = {
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : null,
    updates: Array.isArray(payload.updates) ? payload.updates.filter(isPlausibleUpdate) : [],
  };
  persistSnapshot(state);
  return state;
}

export async function requestGovSyncRefresh(): Promise<{ ok: boolean; message: string; state: GovSyncState }> {
  const res = await fetch('/api/gst/updates/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data: unknown = await res.json().catch(() => null);
  const payload = (data && typeof data === 'object' ? data : {}) as {
    success?: boolean; message?: unknown; error?: unknown; updatedAt?: unknown; updates?: unknown;
  };
  if (!res.ok) {
    const msg = typeof payload.error === 'string' ? payload.error : `Sync failed (${res.status})`;
    return { ok: false, message: msg, state: readGovSyncSnapshot() };
  }
  const state: GovSyncState = {
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : readGovSyncSnapshot().updatedAt,
    updates: Array.isArray(payload.updates) ? payload.updates.filter(isPlausibleUpdate) : readGovSyncSnapshot().updates,
  };
  persistSnapshot(state);
  const message = typeof payload.message === 'string'
    ? payload.message
    : (typeof payload.error === 'string' ? payload.error : 'Sync complete');
  return { ok: payload.success === true, message, state };
}

export function formatGovSyncAge(updatedAt: string | null): string {
  if (!updatedAt) return 'never checked';
  const ts = Date.parse(updatedAt);
  if (Number.isNaN(ts)) return 'never checked';
  const diff = Date.now() - ts;
  if (diff < 60 * 1000) return 'just now';
  if (diff < 60 * 60 * 1000) {
    const m = Math.floor(diff / (60 * 1000));
    return `${m} min ago`;
  }
  if (diff < 24 * 60 * 60 * 1000) {
    const h = Math.floor(diff / (60 * 60 * 1000));
    return `${h} hr ago`;
  }
  try {
    return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'over a day ago';
  }
}
