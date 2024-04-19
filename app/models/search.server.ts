import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import { Prisma, type Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import type { SearchResultEnum } from "~/routes/search/searchResultEnum"
import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { parsePageNumberOrError } from "~/utils/generalUtils"

export type { Entry } from "@prisma/client"

export const SEARCH_WILDCARD = "*"

export type AllSearchResults = {
  [SearchResultEnum.HEADWORD]?: Pick<Entry, "id" | "headword">[]
  [SearchResultEnum.MEANING]?: SearchResultMeaning[]
  [SearchResultEnum.CANADIANISM]?: Canadianism[]
  [SearchResultEnum.USAGE_NOTE]?: UsageNote[]
  [SearchResultEnum.FIST_NOTE]?: FistNote[]
  [SearchResultEnum.QUOTATION]?: Quotation[]
}

type SearchResultParams = {
  text: string
  skip: number
  take?: number
  caseSensitive: boolean
  versions: string[]
  canadianismTypes: string[]
  isUserAdmin: boolean
  nonCanadianismOnly?: boolean
}

export async function getSearchResults({
  text,
  page = "1",
  caseSensitive = false,
  // attribute = SearchResultEnum.HEADWORD,
  dchpVersions,
  canadianismTypesArg,
  isUserAdmin,
  nonCanadianismOnly,
}: {
  text: string
  page: string | undefined
  caseSensitive: boolean
  // attribute: string
  dchpVersions?: string[]
  canadianismTypesArg?: string[]
  isUserAdmin: boolean
  nonCanadianismOnly?: boolean
}): Promise<AllSearchResults> {
  const pageNumber = parsePageNumberOrError(page)
  const skip: number = calculatePageSkip(pageNumber)
  const versions = dchpVersions || ["dchp1", "dchp2", "dchp3"]
  const canadianismTypes = canadianismTypesArg || [...BASE_CANADANISM_TYPES]

  const params = {
    text,
    skip,
    caseSensitive,
    versions,
    canadianismTypes,
    isUserAdmin,
    nonCanadianismOnly,
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

export function getEntriesByBasicTextSearch({
  text,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  versions,
  isUserAdmin = false,
}: SearchResultParams) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }
  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  return prisma.$queryRaw<Pick<Entry, "id" | "headword" | "is_public">[]>`
  SELECT
    id, headword, is_public
  FROM det_entries
  WHERE
    IF(${caseSensitive},
      (headword) LIKE (${searchWildcard}),
      LOWER(headword) LIKE LOWER(${searchWildcard})
    )
    AND (det_entries.dchp_version IN (${Prisma.join(versions)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
  ORDER BY headword ASC LIMIT ${take} OFFSET ${skip}
  `
}

export interface SearchResultMeaning {
  id: number
  definition: string
  entry: {
    headword: string
  }
}

// TODO: refactor to use Case Sensitive
export function getSearchResultMeanings({
  text,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  canadianismTypes = BASE_CANADANISM_TYPES,
  nonCanadianismOnly = false,
}: SearchResultParams): Promise<SearchResultMeaning[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const where: any = {
    entry: {
      is_public: true,
      no_cdn_conf: nonCanadianismOnly,
    },
    definition: {
      contains: text === SEARCH_WILDCARD ? "" : text,
    },
  }

  if (canadianismTypes.length !== BASE_CANADANISM_TYPES.length) {
    where.canadianism_type = {
      in: canadianismTypes,
    }
  }

  return prisma.meaning.findMany({
    where,
    select: {
      entry: {
        select: {
          headword: true,
        },
      },
      definition: true,
      id: true,
    },
    skip: skip,
    take: take,
  })
}

export interface Canadianism {
  headword: string
  canadianismDescription: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultCanadianisms({
  text,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  versions,
  isUserAdmin = false,
}: SearchResultParams): Promise<Canadianism[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  return prisma.$queryRaw<Canadianism[]>`
  SELECT
    det_entries.headword as headword,
    det_meanings.canadianism_type_comment,
    det_meanings.id
  FROM det_meanings, det_entries
  WHERE
    det_meanings.entry_id = det_entries.id
    AND IF(${caseSensitive},
      (det_meanings.canadianism_type_comment) LIKE (${searchWildcard}),
      LOWER(det_meanings.canadianism_type_comment) LIKE LOWER(${searchWildcard})
    )
    AND (det_entries.dchp_version IN (${Prisma.join(versions)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
  ORDER BY LOWER(det_entries.headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export interface UsageNote {
  headword: string
  partOfSpeech: string
  usage: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultUsageNotes({
  text,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  versions,
  isUserAdmin = false,
}: SearchResultParams): Promise<UsageNote[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  return prisma.$queryRaw<UsageNote[]>`
  SELECT
    det_entries.headword as headword,
    det_meanings.usage,
    det_meanings.partofspeech,
    det_meanings.id
  FROM det_meanings, det_entries
  WHERE
    det_meanings.entry_id = det_entries.id
    AND IF(${caseSensitive},
      (det_meanings.usage) LIKE (${searchWildcard}),
      LOWER(det_meanings.usage) LIKE LOWER(${searchWildcard})
    )
    AND (det_entries.dchp_version IN (${Prisma.join(versions)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
  ORDER BY LOWER(det_entries.headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export interface FistNote {
  headword: string
  fistNote: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultFistNotes({
  text,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  versions,
  isUserAdmin = false,
}: SearchResultParams): Promise<FistNote[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  // TODO: Change this
  return prisma.$queryRaw<FistNote[]>`
  SELECT
    headword,
    fist_note,
    id
  FROM det_entries
  WHERE
    IF(${caseSensitive},
      (fist_note) LIKE (${searchWildcard}),
      LOWER(fist_note) LIKE LOWER(${searchWildcard}))
    AND (det_entries.dchp_version IN (${Prisma.join(versions)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
  ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export interface Quotation {
  id: number
  headword: {
    headword: string
  } | null
  text: string | null
}

// case sensitivity not working; check collation
export function getSearchResultQuotations({
  text,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
}: SearchResultParams): Promise<Quotation[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  return prisma.bankCitation.findMany({
    where: {
      OR: [
        {
          text: {
            contains: searchWildcard,
          },
        },
        {
          headword: {
            headword: {
              contains: searchWildcard,
            },
          },
        },
      ],
    },
    skip: skip,
    take: take,
    orderBy: {
      id: "asc",
    },
    select: {
      text: true,
      id: true,
      headword: {
        select: { headword: true },
      },
    },
  })
}
