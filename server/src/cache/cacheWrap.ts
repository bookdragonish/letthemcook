import  { Redis } from "ioredis";

/**
 * AI GEN: This cache wrapper was written by chat gpt
 *
 * cacheWrap<T>
 * -------------
 * A lightweight helper for resolver-level caching using Redis.
 *
 * Workflow:
 * 1. Checks Redis for an existing value under the given key.
 * 2. On a cache HIT: parses and returns the cached JSON value.
 * 3. On a cache MISS: executes the provided fetcher callback,
 *    stores its result in Redis with the given TTL, and returns it.
 *
 * Notes:
 * - Logs HIT/MISS for debugging (may appear twice in development due to React Strict Mode).
 * - All cached values are serialized as JSON.
 * - Keeps resolver code clean by centralizing all caching logic here.
 *
 * @param redis       Connected Redis client instance
 * @param key         Cache key to read/write
 * @param ttlSeconds  Time to live (seconds) for the cached entry
 * @param fetcher     Function that fetches fresh data on a cache MISS
 * @returns           Cached or freshly fetched value
 */
export async function cacheWrap<T>(
  redis: Redis,
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {

  //Checks if the element could be located in cache using key
  const hit = await redis.get(key);

  // Activate to se console logs for hit and miss
  if (hit) console.log(`[cache] HIT ${key}`);
  else console.log(`[cache] MISS ${key}`);

  // HIT:
  if (hit) return JSON.parse(hit) as T;

  // MISS:
  const fresh = await fetcher();
  // Store the fetched in redis
  await redis.set(key, JSON.stringify(fresh), "EX", ttlSeconds);
  return fresh;
}
