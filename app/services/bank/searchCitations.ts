import type { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import type {
  BankLegacyTypeEnum,
  BankSourceTypeEnum,
} from "~/models/bank.types"
import { calculateSkip } from "~/utils/generalUtils"

export const PAGE_SIZE = 100

export type SearchOptions = {
  exactPhrase?: boolean | null
  orderBy?: string | null
  orderDirection?: string | null
  placeName?: string | null
  searchField?: "citation" | "headword" | null
  searchTerm: string
  sourceCeilingYear?: string | null
  sourceFloorYear?: string | null
  sourceType?: BankSourceTypeEnum | "all" | null
  legacyType?: BankLegacyTypeEnum | "all" | null
  horizon?: string | null
  page?: string | null
}

export default async function (opts: SearchOptions) {
  const { searchTerm } = opts

  const dates =
    opts.sourceFloorYear || opts.sourceCeilingYear
      ? {
          source: {
            year_published: {
              gte: opts.sourceFloorYear || undefined,
              lte: opts.sourceCeilingYear || undefined,
            },
          },
        }
      : {}

  const place = opts.placeName
    ? { source: { place: { name: { contains: opts.placeName } } } }
    : {}

  // const access = `` // TODO: Restore this.

  const sourceType =
    opts.sourceType === "all" ||
    opts.sourceType === undefined ||
    opts.sourceType === null
      ? {}
      : { source: { type_id: opts.sourceType } }

  const legacyType =
    opts.legacyType === "all" ||
    opts.legacyType === undefined ||
    opts.legacyType === null
      ? {}
      : { legacy_id: parseInt(opts.legacyType as unknown as string) }

  const orderDirection: Prisma.SortOrder =
    opts.orderDirection === "desc" ? "desc" : "asc"

  const orderBy =
    opts.orderBy === "year"
      ? { source: { year_published: orderDirection } }
      : opts.orderBy === "place"
      ? { source: { place: { name: orderDirection } } }
      : { id: orderDirection }

  let textSearch =
    opts.searchField === "headword"
      ? {
          headword: {
            headword: opts.exactPhrase ? searchTerm : { contains: searchTerm },
          },
        }
      : { text: opts.exactPhrase ? searchTerm : { contains: searchTerm } }

  const skip = calculateSkip(opts.page, PAGE_SIZE)

  const count = await prisma.bankCitation.count({
    where: {
      ...dates,
      ...place,
      ...sourceType,
      ...legacyType,
      ...textSearch,
    },
  })

  const results = await prisma.bankCitation.findMany({
    where: {
      ...dates,
      ...place,
      ...sourceType,
      ...legacyType,
      ...textSearch,
    },
    skip: skip,
    take: PAGE_SIZE,
    orderBy,
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

  return { count, page: opts.page || 1, citations: results }
}
