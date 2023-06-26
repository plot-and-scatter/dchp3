import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import type { Entry, Meaning } from "@prisma/client"
import { prisma } from "~/db.server"
import { parsePageNumberOrError } from "~/utils/generalUtils"
import { isNonPositive } from "~/utils/numberUtils"

export type { Entry } from "@prisma/client"

const MAX_RESULTS = 1000

export async function getSearchResultsByPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  interface entryAndFunctionMap {
    [key: string]: (
      text: string,
      skip: number,
      take: number,
      caseSensitive: boolean
    ) => any
  }

  console.log("page number here: " + page)

  // TODO: Extract these to be constant strings at the top of this file
  // TODO: make better name
  let kvp: entryAndFunctionMap = {}
  kvp["entries"] = getEntriesByBasicTextSearch
  kvp["meanings"] = getSearchResultsFromMeanings

  type Result = Record<string, Array<any>>
  let results: Result = {}

  const pageNumber = parsePageNumberOrError(page)
  // TODO: Toggle stuff below. Causes a bug. Search "Za"

  let elementsToSkip = calculatePageSkip(pageNumber)
  let elementsRemaining = DEFAULT_PAGE_SIZE

  for (const key in kvp) {
    // get results
    let resultValues: any[] = await kvp[key](
      text,
      0,
      MAX_RESULTS,
      caseSensitive
    )

    let resultLength = resultValues.length

    if (resultLength > elementsToSkip) {
      resultValues = resultValues.slice(
        elementsToSkip,
        elementsToSkip + elementsRemaining
      )
      elementsToSkip = 0
      // add the first 100 values in resultValues to results
      // you want to then subtract this from the elementsToGet
    } else {
      resultValues = []
      elementsToSkip = elementsToSkip - resultLength
    }

    results[key] = resultValues
    elementsRemaining -= results[key].length

    console.log(resultValues.length)
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
