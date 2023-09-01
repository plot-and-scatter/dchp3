import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { prisma } from "~/db.server"

const DEFAULT_TAKE_SIZE = 100

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const startsWith = url.searchParams.get("startsWith")
  const takeParam = url.searchParams.get("take")

  const take =
    takeParam && Number.isInteger(Number(takeParam))
      ? parseInt(takeParam)
      : DEFAULT_TAKE_SIZE

  const headwords = await prisma.entry.findMany({
    where: startsWith ? { headword: { startsWith } } : undefined,
    select: { headword: true, id: true },
    orderBy: [{ headword: "asc" }],
    take,
  })

  return json(headwords)
}
