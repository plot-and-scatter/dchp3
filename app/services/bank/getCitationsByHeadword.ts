import type {
  BankCitation,
  BankHeadword,
  BankPlace,
  BankSource,
} from "@prisma/client"
import { prisma } from "~/db.server"

export type CitationByHeadword = Pick<
  BankCitation,
  | "user_id"
  | "last_modified_user_id"
  | "text"
  | "id"
  | "short_meaning"
  | "spelling_variant"
  | "created"
  | "last_modified"
  | "source_id"
> &
  Pick<BankHeadword, "headword"> &
  Pick<BankSource, "year_published" | "year_composed" | "type_id"> & {
    place_name: BankPlace["name"]
  }

export default async function (headword: string) {
  const query = `${headword}%`

  const citations = await prisma.$queryRaw<CitationByHeadword[]>`

  SELECT
    c.user_id,
    c.last_modified_user_id,
    c.text,
    c.id,
    c.short_meaning,
    c.spelling_variant,
    c.created,
    c.last_modified,
    c.source_id,
    h.headword,
    s.year_published,
    s.year_composed,
    s.type_id,
    p.name as place_name

  FROM
    citation AS c
    INNER JOIN headword AS h ON c.headword_id = h.id
    LEFT JOIN source AS s ON c.source_id = s.id
    LEFT JOIN place AS p ON s.place_id = p.id

  WHERE h.headword LIKE ${query}

  ORDER BY c.created ASC`

  return citations
}
