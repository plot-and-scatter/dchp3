import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import type { Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import { parsePageNumberOrError } from "~/utils/generalUtils"

export type { Entry } from "@prisma/client"

const MAX_RESULTS = 1000

function getAttributeFunctionMap() {
  interface AttributeFunctionMap {
    [key: string]: (
      text: string,
      skip: number,
      take: number,
      caseSensitive: boolean
    ) => any
  }

  let attributeFunctionMap: AttributeFunctionMap = {}
  attributeFunctionMap["entries"] = getEntriesByBasicTextSearch
  attributeFunctionMap["meanings"] = getSearchResultsFromMeanings

  return attributeFunctionMap
}

function getElementsAfterApplyingSkipAndTake(
  values: any[],
  length: number,
  skip: number,
  take: number
) {
  return length > skip ? values.slice(skip, skip + take) : []
}

function calculateNewSkip(length: number, skip: number) {
  return (skip = length <= skip ? skip - length : 0)
}

function calculateElementsRemaining(remaining: number, gotten: number) {
  return remaining - gotten
}

export async function getSearchResults(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false,
  attribute: string = SearchResultEnum.HEADWORD
): Promise<any[]> {
  switch (attribute) {
    case SearchResultEnum.HEADWORD:
      return getEntriesByBasicTextSearchAndPage(text, page, caseSensitive)
    case SearchResultEnum.MEANING:
      return getSearchResultsFromMeaningsAndPage(text, page, caseSensitive)
    case SearchResultEnum.CANADIANISM:
      return getSearchResultsFromCanadianismAndPage(text, page, caseSensitive)
    case SearchResultEnum.USAGE_NOTE:
      return getSearchResultsFromUsageNotesAndPage(text, page, caseSensitive)
    case SearchResultEnum.FIST_NOTE:
      return getSearchResultsFromFistNoteAndPage(text, page, caseSensitive)

    default:
      throw new Error(`attribute ${attribute} must be a valid search result`)
  }
}

// TODO: Delete this function and related
export async function getSearchResultsByPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  type Result = Record<string, Array<any>>
  let results: Result = {}

  const attributeFunctionMap = getAttributeFunctionMap()

  const pageNumber = parsePageNumberOrError(page)
  let elementsToSkip = calculatePageSkip(pageNumber)
  let maxTake = DEFAULT_PAGE_SIZE

  /**
   * attribute: Entry, Meaning, etc.
   *
   * elementsToSkip: We want to skip a certain number of elements based
   *  on the page number. We need to keep track of this between different
   *  attributes. If there are 40 headwords and 70 meanings, then page 2
   *  should skip the first hundred elements and return the last 10 meanings
   *
   * maxTake: we want to return to the user maximum 100 entries. So
   *  as we obtain more data,
   */
  for (const attribute in attributeFunctionMap) {
    let allAttributeValues: any[] = await attributeFunctionMap[attribute](
      text,
      0,
      MAX_RESULTS,
      caseSensitive
    )
    let resultLength = allAttributeValues.length

    let resultsForCurrentPage: any[] = getElementsAfterApplyingSkipAndTake(
      allAttributeValues,
      resultLength,
      elementsToSkip,
      maxTake
    )

    elementsToSkip = calculateNewSkip(resultLength, elementsToSkip)
    maxTake = calculateElementsRemaining(maxTake, resultsForCurrentPage.length)

    results[attribute] = resultsForCurrentPage

    // maxTake is now zero-- no possibility of adding further items
    if (maxTake === 0) {
      break
    }
  }

  return results
}

export function getEntriesByBasicTextSearchAndPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  const pageNumber = parsePageNumberOrError(page)
  const skip: number = (pageNumber - 1) * DEFAULT_PAGE_SIZE
  return getEntriesByBasicTextSearch(text, skip, undefined, caseSensitive)
}

export function getEntriesByBasicTextSearch(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Error(`Text ("${text}") length must be greater than zero`)
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

export function getSearchResultsFromMeaningsAndPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  const pageNumber = parsePageNumberOrError(page)
  const skip = calculatePageSkip(pageNumber)
  return getSearchResultsFromMeanings(text, skip, undefined, caseSensitive)
}

// TODO: refactor to use Case Sensitive
export function getSearchResultsFromMeanings(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Error(`Text ("${text}") length must be greater than zero`)
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
export function getSearchResultsFromCanadianismAndPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  const pageNumber = parsePageNumberOrError(page)
  const skip = calculatePageSkip(pageNumber)
  return getSearchResultsFromCanadianism(text, skip, undefined, caseSensitive)
}

export interface Canadianism {
  headword: string
  canadianismDescription: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultsFromCanadianism(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Error(`Text ("${text}") length must be greater than zero`)
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

export function getSearchResultsFromUsageNotesAndPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  const pageNumber = parsePageNumberOrError(page)
  const skip = calculatePageSkip(pageNumber)
  return getSearchResultsFromUsageNotes(text, skip, undefined, caseSensitive)
}

export interface UsageNote {
  headword: string
  usage: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultsFromUsageNotes(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Error(`Text ("${text}") length must be greater than zero`)
  }

  const searchWildcard = `%${text}%`

  return prisma.$queryRaw<UsageNote[]>`SELECT det_entries.headword as headword,
  det_meanings.usage, det_meanings.id
  FROM det_meanings, det_entries
  WHERE det_meanings.entry_id = det_entries.id AND
  IF(${caseSensitive}, 
    (det_meanings.usage) LIKE (${searchWildcard}), 
    LOWER(det_meanings.usage) LIKE LOWER(${searchWildcard}))  
  ORDER BY LOWER(det_entries.headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export function getSearchResultsFromFistNoteAndPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  const pageNumber = parsePageNumberOrError(page)
  const skip = calculatePageSkip(pageNumber)
  return getSearchResultsFromFistNote(text, skip, undefined, caseSensitive)
}

// TODO: change this
export interface FistNote {
  headword: string
  usage: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultsFromFistNote(
  text: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Error(`Text ("${text}") length must be greater than zero`)
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
