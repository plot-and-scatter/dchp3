import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import { getEntriesByBasicTextSearch } from "./search/getEntriesByBasicTextSearch"
import { getSearchResultCanadianisms } from "./search/getSearchResultCanadianisms"
import { getSearchResultFistNotes } from "./search/getSearchResultFistNotes"
import { getSearchResultMeanings } from "./search/getSearchResultMeanings"
import { getSearchResultQuotations } from "./search/getSearchResultQuotations"
import { getSearchResultUsageNotes } from "./search/getSearchResultUsageNotes"
import type { Canadianism } from "./search/getSearchResultCanadianisms"
import type { Entry } from "@prisma/client"
import type { FistNote } from "./search/getSearchResultFistNotes"
import type { Quotation } from "./search/getSearchResultQuotations"
import type { SearchActionSchema } from "~/routes/search"
import type { SearchResultMeaning } from "./search/getSearchResultMeanings"
import type { UsageNote } from "./search/getSearchResultUsageNotes"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import { getCounts } from "./search/getCounts.server"

export const SEARCH_WILDCARD = "*"

export type SearchResultParams = SearchActionSchema & {
  isUserAdmin: boolean
  take: number
  skip: number
}

export type AllSearchResults = {
  counts: {
    [SearchResultEnum.ALL]: number
    [SearchResultEnum.HEADWORD]: number
    [SearchResultEnum.MEANING]: number
    [SearchResultEnum.CANADIANISM]: number
    [SearchResultEnum.USAGE_NOTE]: number
    [SearchResultEnum.FIST_NOTE]: number
    [SearchResultEnum.QUOTATION]: number
  }
  data:
    | {
        type: SearchResultEnum.HEADWORD | SearchResultEnum.ALL
        entries: Pick<Entry, "id" | "headword">[]
      }
    | { type: SearchResultEnum.MEANING; entries: SearchResultMeaning[] }
    | { type: SearchResultEnum.CANADIANISM; entries: Canadianism[] }
    | { type: SearchResultEnum.USAGE_NOTE; entries: UsageNote[] }
    | { type: SearchResultEnum.FIST_NOTE; entries: FistNote[] }
    | { type: SearchResultEnum.QUOTATION; entries: Quotation[] }
}

export async function getSearchResults(
  searchParams: SearchActionSchema,
  isUserAdmin: boolean
): Promise<AllSearchResults> {
  const versions = searchParams.database || ["dchp1", "dchp2", "dchp3"]
  const canadianismTypes = searchParams.canadianismType || [
    ...BASE_CANADANISM_TYPES,
  ]

  const params = {
    ...searchParams,
    skip: calculatePageSkip(searchParams.page),
    take: DEFAULT_PAGE_SIZE,
    versions,
    isUserAdmin,
    canadianismTypes,
  }

  const searchResults: AllSearchResults = {
    counts: await getCounts(params),
    data: { type: SearchResultEnum.HEADWORD, entries: [] },
  }

  switch (searchParams.attribute) {
    case SearchResultEnum.MEANING:
      searchResults.data = {
        type: SearchResultEnum.MEANING,
        entries: await getSearchResultMeanings(params),
      }
      break
    case SearchResultEnum.CANADIANISM:
      searchResults.data = {
        type: SearchResultEnum.CANADIANISM,
        entries: await getSearchResultCanadianisms(params),
      }
      break
    case SearchResultEnum.USAGE_NOTE:
      searchResults.data = {
        type: SearchResultEnum.USAGE_NOTE,
        entries: await getSearchResultUsageNotes(params),
      }
      break
    case SearchResultEnum.FIST_NOTE:
      searchResults.data = {
        type: SearchResultEnum.FIST_NOTE,
        entries: await getSearchResultFistNotes(params),
      }
      break
    case SearchResultEnum.QUOTATION:
      searchResults.data = {
        type: SearchResultEnum.QUOTATION,
        entries: await getSearchResultQuotations(params),
      }
      break
    case SearchResultEnum.HEADWORD:
    default:
      searchResults.data = {
        type: SearchResultEnum.HEADWORD,
        entries: await getEntriesByBasicTextSearch(params),
      }
      break
  }

  return searchResults
}
