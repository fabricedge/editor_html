// components/cacheManager.ts

//  1- check if the browser its not caching the request
//  2- 

export interface CachedData {
  content: string;
  updated_at: number;
  savedInDB: boolean; // new flag
}

export function getCacheKey(pageId: string): string {
  return `editor_cache_${pageId}`;
}

export function loadFromCache(pageId: string): CachedData | null {
  try {
    const cached = localStorage.getItem(getCacheKey(pageId));
    console.log("page id from loadFromCache", pageId)
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error("Error reading cache:", err);
    return null;
  }
}

export function saveToCache(pageId: string, content: string, savedInDB: boolean = false): void {
  console.log("arguments save to cache:", arguments)
  try {
    const data: CachedData = {
      content,
      updated_at: Date.now(),
      savedInDB,
    };
    localStorage.setItem(getCacheKey(pageId), JSON.stringify(data));
  } catch (err) {
    console.error("Error writing cache:", err);
  }
}

export function isCacheNewer(cache: CachedData | null, serverUpdatedAt?: string): boolean {
  if (!cache) return false;
  if (!cache.savedInDB) return false; // Only consider cached versions that were saved in DB
  if (!serverUpdatedAt) return true;
  const serverTime = new Date(serverUpdatedAt).getTime();
  return cache.updated_at > serverTime;
}
