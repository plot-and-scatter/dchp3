import type {
  BankCitation,
  BankHeadword,
  BankPlace,
  BankSource,
  User,
} from "@prisma/client"
import { prisma } from "~/db.server"
import { getUserIdByEmailOrThrow } from "~/models/user.server"

export type OwnCitation = Pick<
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
  } & Pick<User, "email">

export default async function (
  email: string,
  skip?: number,
  take: number = 20
) {
  const userId = await getUserIdByEmailOrThrow({ email })

  // TODO: Paginate this
  const results = await prisma.$queryRaw<OwnCitation[]>`

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
    p.name as place_name,
    u.email

  FROM
    citation AS c,
    headword AS h,
    source AS s,
    place AS p,
    user AS u

  WHERE
    (c.user_id=${userId} OR c.last_modified_user_id=${userId})
    AND c.headword_id=h.id
    AND c.source_id=s.id
    AND s.place_id=p.id
    AND c.user_id=u.id

  ORDER BY c.created DESC

  LIMIT 100`

  return results
}
