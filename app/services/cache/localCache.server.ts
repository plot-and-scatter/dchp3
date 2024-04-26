export class LocalCache {
  protected _cache: Record<
    string,
    { key: string; value: string; expiry?: number }
  > = {}

  constructor() {
    console.log("Constructed local cache.")
  }

  put(
    key: string,
    value: string,
    { expirationTtl }: { expirationTtl?: number } = {}
  ) {
    this._cache[key] = {
      key,
      value,
      expiry: expirationTtl ? Date.now() + expirationTtl * 1000 : undefined,
    }
  }

  get(key: string) {
    this.clearExpired()
    return this._cache[key]?.value
  }

  clearExpired() {
    const currentTime = Date.now()
    Object.values(this._cache).forEach((value) => {
      // console.log(
      //   'value',
      //   value.key,
      //   value.expiry?.toLocaleString(),
      //   currentTime?.toLocaleString()
      // )
      if (value.expiry && value.expiry < currentTime) {
        delete this._cache[value.key]
      }
    })
  }
}
