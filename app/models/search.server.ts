import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import type { Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import { parsePageNumberOrError } from "~/utils/generalUtils"
import { isNonPositive } from "~/utils/numberUtils"

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
) {
  console.log("attribute new:" + attribute)

  switch (attribute) {
    case SearchResultEnum.HEADWORD:
      return getEntriesByBasicTextSearchAndPage(text, page, caseSensitive)
    case SearchResultEnum.MEANING:
      return getSearchResultsFromMeaningsAndPage(text, page, caseSensitive)
    default:
      throw new Error(`attribute ${attribute} must be a valid search result`)
  }
}

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
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be a number`)
  } else if (isNonPositive(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be greater than zero`)
  }

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
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be a number`)
  } else if (isNonPositive(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be greater than zero`)
  }

  const skip = calculatePageSkip(pageNumber)
  const take = DEFAULT_PAGE_SIZE
  return getSearchResultsFromMeanings(text, skip, take, caseSensitive)
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
