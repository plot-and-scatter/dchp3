import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import type { Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import { parsePageNumberOrError } from "~/utils/generalUtils"

export type { Entry } from "@prisma/client"

export async function getSearchResults(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false,
  attribute: string = SearchResultEnum.HEADWORD
): Promise<any[]> {
  const pageNumber = parsePageNumberOrError(page)
  const skip: number = calculatePageSkip(pageNumber)

  switch (attribute) {
    case SearchResultEnum.HEADWORD:
      return getEntriesByBasicTextSearch(text, skip, undefined, caseSensitive)
    case SearchResultEnum.MEANING:
      return getSearchResultMeanings(text, skip, undefined, caseSensitive)
    case SearchResultEnum.CANADIANISM:
      return getSearchResultCanadianisms(text, skip, undefined, caseSensitive)
    case SearchResultEnum.USAGE_NOTE:
      return getSearchResultUsageNotes(text, skip, undefined, caseSensitive)
    case SearchResultEnum.FIST_NOTE:
      return getSearchResultFistNotes(text, skip, undefined, caseSensitive)
    case SearchResultEnum.QUOTATION:
      return getSearchResultQuotations(text, skip, undefined, caseSensitive)
    default:
      throw new Response(null, {
        status: 400,
        statusText: `attribute "${attribute}" must be a valid search attribute`,
      })
  }
}

export function getEntriesByBasicTextSearch(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }
  const searchWildcard = `%${text}%`

  return prisma.$queryRaw<
    Pick<Entry, "id" | "headword">[]
  >`SELECT id, headword FROM det_entries 
    WHERE IF(${caseSensitive}, 
      (headword) LIKE (${searchWildcard}), 
      LOWER(headword) LIKE LOWER(${searchWildcard}))  
    ORDER BY headword ASC LIMIT ${take} OFFSET ${skip}`
}

// TODO: refactor to use Case Sensitive
export function getSearchResultMeanings(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  return prisma.meaning.findMany({
    where: {
      definition: {
        contains: text,
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
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = `%${text}%`

  return prisma.$queryRaw<
    Canadianism[]
  >`SELECT det_entries.headword as headword,
  det_meanings.canadianism_type_comment, det_meanings.id
  FROM det_meanings, det_entries
  WHERE det_meanings.entry_id = det_entries.id AND
  IF(${caseSensitive}, 
    (det_meanings.canadianism_type_comment) LIKE (${searchWildcard}), 
    LOWER(det_meanings.canadianism_type_comment) LIKE LOWER(${searchWildcard}))  
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
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = `%${text}%`

  return prisma.$queryRaw<UsageNote[]>`SELECT det_entries.headword as headword,
  det_meanings.usage, det_meanings.partofspeech, det_meanings.id
  FROM det_meanings, det_entries
  WHERE det_meanings.entry_id = det_entries.id AND
  IF(${caseSensitive}, 
    (det_meanings.usage) LIKE (${searchWildcard}), 
    LOWER(det_meanings.usage) LIKE LOWER(${searchWildcard}))  
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
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = `%${text}%`

  // TODO: Change this
  return prisma.$queryRaw<FistNote[]>`SELECT headword, fist_note, id
  FROM det_entries
  WHERE IF(${caseSensitive}, 
    (fist_note) LIKE (${searchWildcard}), 
    LOWER(fist_note) LIKE LOWER(${searchWildcard}))  
  ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
}

// case sensitivity not working; check collation
export function getSearchResultQuotations(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Response(null, {
      status: 400,
      statusText: `Text length must be greater than zero`,
    })
  }

  const searchWildcard = `%${text}%`

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
      user_id: true,
      last_modified_user_id: true,
      text: true,
      clipped_text: true,
      id: true,
      short_meaning: true,
      last_modified: true,
      source_id: true,
      spelling_variant: true,
      headword: {
        select: { headword: true },
      },
      source: {
        select: {
          year_published: true,
          year_composed: true,
          type_id: true,
          place: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
}
