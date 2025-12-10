import Redis from "ioredis";


/**AI GEN: this code was ai generated with the purouse to provide the option to 
 * run code both with and without the redis cache.
 * 
 * redisClient.ts
 * ---------------
 * Creates and manages the Redis client used by the server.
 *
 * Behavior:
 * - If REDIS_URL is missing, Redis caching is disabled and the server
 *   falls back to non-cached resolver logic.
 *
 * - If REDIS_URL is provided:
 *    • A Redis client is created using ioredis.
 *    • TLS is enabled automatically when using a `rediss://` URL
 *      (required by Redis Cloud).
 *
 * - The `redisAvailable` flag tracks whether Redis is usable.
 *   It is set to `false` when:
 *    • REDIS_URL is not configured, or
 *    • A connection error occurs (e.g., invalid hostname or downtime).
 *
 * - Resolvers should check `redisAvailable` before attempting to cache.
 *
 * Exports:
 * - `redis`: the Redis client instance or `null` if disabled.
 * - `redisAvailable`: boolean indicating whether Redis can be used.
 */

export let redisAvailable = true;

// No link gives warning
if (!process.env.REDIS_URL) {
  console.warn("REDIS_URL not set — running without Redis caching.");
  redisAvailable = false;
}

// This code export redis when the link lead to the server
export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
    })
  : null;

// Detect connection failures. For example if the link provided is giberish
redis?.on("error", (err) => {
  console.error("[redis error]", err.message);
  redisAvailable = false;
});