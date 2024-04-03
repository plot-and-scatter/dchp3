import type { Reference } from "@prisma/client"
import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { prisma } from "~/db.server"

// const DEFAULT_TAKE_SIZE = 500

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const containsText = url.searchParams.get("containsText")

  if (containsText === null || containsText.length === 0) {
    throw json(
      {
        message: `containsText param is required, and must be a string of length > 0`,
      },
      { status: 400 }
    )
  }

  const initialLettersWildcard = `%${containsText}%`

  const references = await prisma.$queryRaw<
    Reference[]
  >`SELECT * FROM det_references WHERE LOWER(short_display) LIKE LOWER(${initialLettersWildcard}) OR LOWER(reference_text) LIKE LOWER(${initialLettersWildcard}) ORDER BY LOWER(short_display) ASC`

  return json(references)
}
