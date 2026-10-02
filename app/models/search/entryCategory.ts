import { Prisma } from "@prisma/client"
import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"

// The search page has seven category boxes: the six Canadianism types and
// "Non-Canadianisms". An entry is shown when its category is checked. An
// entry confirmed non-Canadian (`no_cdn_conf`) belongs to that one category
// whatever its meanings say; any other entry belongs to the types of its
// meanings. So: all seven checked shows everything, only Non-Canadianisms
// shows only those, and nothing checked shows nothing (Frank and Stefan,
// 2026-10-01).
//
// Two shapes, because the queries work at two levels. Entry-level results
// (headwords, fist notes) ask whether any meaning has a checked type;
// meaning-level results (meanings, usage notes, canadianism comments,
// quotations) test the row's own type.

type CategoryParams = {
  nonCanadianism?: boolean | null
  canadianismTypes?: string[]
}

const types = (p: CategoryParams) => p.canadianismTypes ?? []

export const allTypesChecked = (p: CategoryParams) =>
  BASE_CANADANISM_TYPES.every((t) => types(p).includes(t))

const typeList = (p: CategoryParams) => Prisma.join(types(p))

/**
 * Raw SQL for the entry aliased `de`. Pass the meaning table's alias when
 * the row is a meaning, so its own `canadianism_type` is tested instead of
 * any meaning of the entry.
 */
export const categorySql = (p: CategoryParams, meaningAlias?: string) => {
  const checked = types(p)
  let typeMatch: Prisma.Sql
  if (checked.length === 0) typeMatch = Prisma.sql`FALSE`
  else if (meaningAlias)
    typeMatch = Prisma.sql`${Prisma.raw(
      meaningAlias
    )}.canadianism_type IN (${typeList(p)})`
  else if (allTypesChecked(p)) typeMatch = Prisma.sql`TRUE`
  else
    typeMatch = Prisma.sql`EXISTS (SELECT 1 FROM det_meanings dmc WHERE dmc.entry_id = de.id AND dmc.canadianism_type IN (${typeList(
      p
    )}))`
  return Prisma.sql`((de.no_cdn_conf = 1 AND ${
    p.nonCanadianism === true
  }) OR (de.no_cdn_conf = 0 AND ${typeMatch}))`
}

/**
 * The same rule as a Prisma `where` fragment for a meaning row (`entry` is
 * the relation). Spread into the meaning's `where`; it adds only `OR`.
 */
export const categoryWhere = (p: CategoryParams) => ({
  OR: [
    ...(p.nonCanadianism === true ? [{ entry: { no_cdn_conf: true } }] : []),
    {
      entry: { no_cdn_conf: false },
      ...(allTypesChecked(p) ? {} : { canadianism_type: { in: types(p) } }),
    },
  ],
})
