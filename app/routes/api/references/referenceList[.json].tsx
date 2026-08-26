import type { Reference } from "@prisma/client"
import { data, type LoaderFunctionArgs } from "react-router"
import { prisma } from "~/db.server"

// const DEFAULT_TAKE_SIZE = 500

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const containsText = url.searchParams.get("containsText")

  if (containsText === null || containsText.length === 0) {
    throw data(
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

  return data(references)
}
