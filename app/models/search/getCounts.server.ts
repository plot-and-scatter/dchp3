import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import type { SearchResultParams } from "../search.server"
import { getMeaningsCount } from "./getSearchResultMeanings"
import { getFistNotesCount } from "./getSearchResultFistNotes"
import { getUsageNotesCount } from "./getSearchResultUsageNotes"
import { getQuotationsCount } from "./getSearchResultQuotations"
import { getCanadianismsCount } from "./getSearchResultCanadianisms"
import { getHeadwordCount } from "./getEntriesByBasicTextSearch"
import { getOrPopulateCache } from "~/services/cache/cache"
// Imported from the package root rather than "crypto-js/md5": crypto-js
// ships no exports map, so under an ESM server build Node cannot resolve the
// extensionless deep path and the server fails to load.
import CryptoJS from "crypto-js"

// Cache the counts for 30 seconds
const COUNT_CACHE_EXPIRY_IN_SECS = 30

export async function getCounts(params: SearchResultParams) {
  // We don't need to take any of these values for the cache key
  const { page, take, skip, attribute, ...rest } = params

  const stringifiedParams = JSON.stringify(rest)

  const cacheKey = CryptoJS.MD5(stringifiedParams).toString()

  const counts = getOrPopulateCache(
    cacheKey,
    async () => {
      const [
        meaningCount,
        fistNoteCount,
        usageNoteCount,
        quotationCount,
        canadianismCount,
        headwordCount,
      ] = await Promise.all([
        getMeaningsCount(params),
        getFistNotesCount(params).then((response) => Number(response[0].count)),
        getUsageNotesCount(params).then((response) =>
          Number(response[0].count)
        ),
        getQuotationsCount(params),
        getCanadianismsCount(params).then((response) =>
          Number(response[0].count)
        ),
        getHeadwordCount(params).then((response) => Number(response[0].count)),
      ])

      const counts = {
        [SearchResultEnum.HEADWORD]: headwordCount,
        [SearchResultEnum.MEANING]: meaningCount,
        [SearchResultEnum.CANADIANISM]: canadianismCount,
        [SearchResultEnum.USAGE_NOTE]: usageNoteCount,
        [SearchResultEnum.FIST_NOTE]: fistNoteCount,
        [SearchResultEnum.QUOTATION]: quotationCount,
      }

      return counts
    },
    {
      expirationTtlInSecs: COUNT_CACHE_EXPIRY_IN_SECS,
      cacheName: stringifiedParams,
    }
  )

  return counts
}
