import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { getEntriesByInitialLetters } from "~/models/entry.server"

const DEFAULT_TAKE_SIZE = 100

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const startsWith = url.searchParams.get("startsWith")
  const takeParam = url.searchParams.get("take")

  if (startsWith === null || startsWith.length === 0) {
    throw json(
      {
        message: `startsWith param is required, and must be a string of length > 0`,
      },
      { status: 400 }
    )
  }

  const take =
    takeParam && Number.isInteger(Number(takeParam))
      ? parseInt(takeParam)
      : DEFAULT_TAKE_SIZE

  const headwords = await getEntriesByInitialLetters(startsWith, 0, take)

  return json(headwords)
}
