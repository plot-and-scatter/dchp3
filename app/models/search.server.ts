import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import type { Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { parsePageNumberOrError } from "~/utils/generalUtils"
import { isNonPositive } from "~/utils/numberUtils"

export type { Entry } from "@prisma/client"

export function getSearchResultsByPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  const pageNumber = parsePageNumberOrError(page)
  const elementsToSkip = calculatePageSkip(pageNumber)
  let elementsToGet = DEFAULT_PAGE_SIZE

  // all functions here. TODO: properly type this array

  const functionsToCall: {
    (text: string, skip: number, take: number, caseSensitive: boolean): any
  }[] = [getEntriesByBasicTextSearch, getSearchResultsFromMeanings]

  functionsToCall.forEach((func) => {
    return func("text", 4, 4, false)
  })

  return functionsToCall[0](text, 0, 100, caseSensitive)

  // return a JSON with
  // - entries
  // - meanings
  // - usage notes
  // etc.
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
  })
}
