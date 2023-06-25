import { DEFAULT_PAGE_SIZE, calculatePageSkip } from "./entry.server"
import type { Entry, Meaning } from "@prisma/client"
import { prisma } from "~/db.server"
import { parsePageNumberOrError } from "~/utils/generalUtils"
import { isNonPositive } from "~/utils/numberUtils"

export type { Entry } from "@prisma/client"

export async function getSearchResultsByPage(
  text: string,
  page: string = "1",
  caseSensitive: boolean = false
) {
  const pageNumber = parsePageNumberOrError(page)
  const elementsToSkip = calculatePageSkip(pageNumber)
  let elementsToGet = DEFAULT_PAGE_SIZE

  // all functions here. TODO: properly type this array

  interface entryAndFunctionMap {
    [key: string]: (
      text: string,
      skip: number,
      take: number,
      caseSensitive: boolean
    ) => any
  }

  // TODO: Extract these to be constant strings at the top of this file
  let kvp: entryAndFunctionMap = {}
  kvp["entries"] = getEntriesByBasicTextSearch
  kvp["meanings"] = getSearchResultsFromMeanings

  let entries: Pick<Entry, "id" | "headword">[] = []
  let meanings: Meaning[] = []

  entries = await kvp["entries"](text, 0, 100, caseSensitive)
  meanings = await kvp["meanings"](text, 0, 100, caseSensitive)

  // TODO: populate those with a for loop. I can kill the dictionary and use an array

  console.log("TEST VALUES")
  console.log(meanings)
  const result = { entries, meanings }

  return result
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
