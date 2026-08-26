import type { FetcherWithComponents } from "react-router"

export const action = () => {
  return null
}

export const resetFetcher = (fetcher: FetcherWithComponents<any>) => {
  fetcher.submit({}, { action: "/api/reset-fetcher", method: "post" })
}
