import type { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import type { BankSourceTypeEnum } from "~/models/bank.types"

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

  const orderDirection: Prisma.SortOrder =
    opts.orderDirection === "reverse" ? "asc" : "desc"

  const orderBy =
    opts.orderBy === "year"
      ? { source: { year_published: orderDirection } }
      : opts.orderBy === "place"
      ? { place: { name: orderDirection } }
      : { id: orderDirection }

  let textSearch =
    opts.searchField === "headword"
      ? {
          headword: {
            headword: opts.exactPhrase ? searchTerm : { contains: searchTerm },
          },
        }
      : { text: opts.exactPhrase ? searchTerm : { contains: searchTerm } }

  const results = await prisma.bankCitation.findMany({
    where: {
      ...dates,
      ...place,
      ...sourceType,
      ...textSearch,
    },
    take: 10,
    orderBy,
    select: {
      user_id: true,
      last_modified_user_id: true,
      text: true,
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

  return results

  // if ($search_type == "1") {
  //   //	$query = "SELECT * FROM dictiondata WHERE $access headword LIKE '%$searchword%' $places $dates";
  //   $query =
  //     "$generalSelect , u.course $generalFrom WHERE $access UCASE(h.headword) LIKE UCASE('%$searchword%') $dates $generalWhere $source_type ORDER BY $ordering $method"
  // }
  // if ($search_type == "2") {
  //   //	$query = "SELECT * FROM dictiondata WHERE $access spellvar LIKE '%$searchword%' $places $dates";
  //   $query =
  //     "$generalSelect $generalFrom WHERE $access UCASE(c.spelling_variant) LIKE UCASE('%$searchword%') $dates $generalWhere $source_type ORDER BY $ordering $method"
  // }
  // if ($search_type == "3") {
  //   //	$query = "SELECT *, MATCH(citation) AGAINST('$searchword' IN BOOLEAN MODE) AS score FROM dictiondata WHERE MATCH(citation) AGAINST ('$searchword' IN BOOLEAN MODE) ORDER BY score DESC, idtag DESC";
  //   //$query = "$generalSelect , MATCH(c.text) AGAINST('$searchword' IN BOOLEAN MODE) AS score $generalFrom WHERE 1=1 $access $generalWhere AND MATCH(c.text) AGAINST ('$searchword' IN BOOLEAN MODE) ORDER BY score DESC, $ordering $method";
  //   $query =
  //     "$generalSelect $generalFrom WHERE 1=1 $access $generalWhere AND c.text LIKE UCASE('%$searchword%') ORDER BY $ordering $method"
  // }
}
