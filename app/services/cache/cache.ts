import { json } from "@remix-run/server-runtime"
import { LocalCache } from "./localCache.server"

declare global {
  var __localCache__: LocalCache
}

const DEFAULT_CACHE_VALIDITY_TTL_SECS = 30 // 30 seconds

export type CacheOptions = {
  expirationTtlInSecs?: number // Seconds
  forcePopulate?: boolean
  cacheName?: string
}

export const getOrPopulateCache = async <T>(
  key: string,
  populateCache: () => Promise<T>,
  {
    expirationTtlInSecs: expirationTtl = DEFAULT_CACHE_VALIDITY_TTL_SECS,
    forcePopulate = false,
    cacheName = "",
  }: CacheOptions = {}
) => {
  // TODO: Throw if this is undefined
  if (global.__localCache__ === undefined) {
    global.__localCache__ = new LocalCache()
  }

  const cache = global.__localCache__

  if (!cache) {
    console.error("No cache found!")
    throw json({ message: `Could not find  cache.` }, { status: 502 })
  }

  if (!forcePopulate) {
    const cacheHit = await cache.get(key)
    if (cacheHit) {
      console.log(`------- CACHE HIT ${key} (${cacheName}) -------`)
      return JSON.parse(cacheHit) as T
    }
  }

  console.log(`------- CACHE MISS ${key} (${cacheName}) -------`)

  const populateResult = await populateCache()

  // TODO: Do we need to await this; fine to run it in the background?
  await cache.put(key, JSON.stringify(populateResult), {
    expirationTtl,
  })

  return populateResult
}
