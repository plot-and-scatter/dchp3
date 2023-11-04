import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import { Prisma, type Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
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

export async function getSearchResults(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false,
  attribute: string = SearchResultEnum.HEADWORD,
  dchpVersions?: string[]
): Promise<AllSearchResults> {
  const pageNumber = parsePageNumberOrError(page)
  const skip: number = calculatePageSkip(pageNumber)

  const versions = dchpVersions || ["dchp1", "dchp2", "dchp3"]

  const searchResults: AllSearchResults = {}
  searchResults.Headword = await getEntriesByBasicTextSearch(
    text,
    skip,
    undefined,
    caseSensitive,
    versions
  )
  searchResults.Meaning = await getSearchResultMeanings(
    text,
    skip,
    undefined,
    caseSensitive,
    versions
  )
  searchResults.Canadianism = await getSearchResultCanadianisms(
    text,
    skip,
    undefined,
    caseSensitive,
    versions
  )
  searchResults.UsageNote = await getSearchResultUsageNotes(
    text,
    skip,
    undefined,
    caseSensitive,
    versions
  )
  searchResults.FistNote = await getSearchResultFistNotes(
    text,
    skip,
    undefined,
    caseSensitive,
    versions
  )

  searchResults.Quotation = await getSearchResultQuotations(
    text,
    skip,
    undefined,
    caseSensitive,
    versions
  )

  return searchResults
}

export function getEntriesByBasicTextSearch(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false,
  dchpVersions: string[]
) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }
  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  return prisma.$queryRaw<Pick<Entry, "id" | "headword">[]>`
  SELECT id, headword FROM det_entries
  WHERE IF(${caseSensitive}, (headword) LIKE (${searchWildcard}), LOWER(headword) LIKE LOWER(${searchWildcard}))
  AND (det_entries.dchp_version IN (${Prisma.join(dchpVersions)}))
  AND (det_entries.is_public = 1)
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
export function getSearchResultMeanings(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false,
  dchpVersions?: string[]
): Promise<SearchResultMeaning[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  return prisma.meaning.findMany({
    where: {
      entry: {
        is_public: true,
      },
      definition: {
        contains: text === SEARCH_WILDCARD ? "" : text,
      },
    },
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
export function getSearchResultCanadianisms(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false,
  dchpVersions: string[]
): Promise<Canadianism[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  return prisma.$queryRaw<Canadianism[]>`SELECT
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
    AND (det_entries.dchp_version IN (${Prisma.join(dchpVersions)}))
    AND det_entries.is_public = 1
  ORDER BY LOWER(det_entries.headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export interface UsageNote {
  headword: string
  partOfSpeech: string
  usage: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultUsageNotes(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false,
  dchpVersions: string[]
): Promise<UsageNote[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  return prisma.$queryRaw<UsageNote[]>`SELECT det_entries.headword as headword,
  det_meanings.usage, det_meanings.partofspeech, det_meanings.id
  FROM det_meanings, det_entries
  WHERE det_meanings.entry_id = det_entries.id
    AND IF(${caseSensitive},
    (det_meanings.usage) LIKE (${searchWildcard}),
    LOWER(det_meanings.usage) LIKE LOWER(${searchWildcard}))
    AND (det_entries.dchp_version IN (${Prisma.join(dchpVersions)}))
    AND det_entries.is_public = 1
  ORDER BY LOWER(det_entries.headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export interface FistNote {
  headword: string
  fistNote: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultFistNotes(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false,
  dchpVersions: string[]
): Promise<FistNote[]> {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = text === SEARCH_WILDCARD ? "%" : `%${text}%`

  // TODO: Change this
  return prisma.$queryRaw<FistNote[]>`SELECT headword, fist_note, id
  FROM det_entries
  WHERE IF(${caseSensitive},
    (fist_note) LIKE (${searchWildcard}),
    LOWER(fist_note) LIKE LOWER(${searchWildcard}))
    AND (det_entries.dchp_version IN (${Prisma.join(dchpVersions)}))
    AND det_entries.is_public = 1
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
export function getSearchResultQuotations(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false,
  dchpVersions: string[]
): Promise<Quotation[]> {
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
