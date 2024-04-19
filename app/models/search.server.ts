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
import type { SearchResultEnum } from "~/routes/search/searchResultEnum"
import type { SearchResultMeaning } from "./search/getSearchResultMeanings"
import type { UsageNote } from "./search/getSearchResultUsageNotes"

export const SEARCH_WILDCARD = "*"

export type SearchResultParams = SearchActionSchema & {
  isUserAdmin: boolean
  take: number
  skip: number
}

export type AllSearchResults = {
  [SearchResultEnum.HEADWORD]?: Pick<Entry, "id" | "headword">[]
  [SearchResultEnum.MEANING]?: SearchResultMeaning[]
  [SearchResultEnum.CANADIANISM]?: Canadianism[]
  [SearchResultEnum.USAGE_NOTE]?: UsageNote[]
  [SearchResultEnum.FIST_NOTE]?: FistNote[]
  [SearchResultEnum.QUOTATION]?: Quotation[]
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

  const searchResults: AllSearchResults = {}
  searchResults.Headword = await getEntriesByBasicTextSearch(params)
  searchResults.Meaning = await getSearchResultMeanings(params)
  searchResults.Canadianism = await getSearchResultCanadianisms(params)
  searchResults.UsageNote = await getSearchResultUsageNotes(params)
  searchResults.FistNote = await getSearchResultFistNotes(params)
  searchResults.Quotation = await getSearchResultQuotations(params)

  return searchResults
}
