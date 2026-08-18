import { CachedData } from "./types";

function getCacheKey(pageId: string): string {
  return `editor_cache_${pageId}`;
}

export function loadFromCache(pageId: string): CachedData | null {
  try {
    const cached = localStorage.getItem(getCacheKey(pageId));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function saveToCache(pageId: string, content: string, savedInDB: boolean = false): void {
  try {
    const data: CachedData = {
      content,
      updated_at: Date.now(),
      savedInDB,
    };
    localStorage.setItem(getCacheKey(pageId), JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function isCacheNewer(cache: CachedData | null, serverUpdatedAt?: string): boolean {
  if (!cache) return false;
  if (!cache.savedInDB) return false;
  if (!serverUpdatedAt) return true;
  const serverTime = new Date(serverUpdatedAt).getTime();
  return cache.updated_at > serverTime;
}
