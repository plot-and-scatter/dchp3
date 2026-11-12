import { data, useRouteLoaderData } from "react-router"
import type { loader as rootLoader } from "~/root"
import { getEditionId } from "./edition.server"
import { DEFAULT_EDITION, isEditionId, type EditionId } from "./edition"
import { EDITIONS } from "./index"

// The edition the current request is being served for, read from the root
// loader. Components use this; server code uses getEditionId() directly.
export const useEdition = () => {
  const root = useRouteLoaderData<typeof rootLoader>("root")
  const id = root?.edition
  return EDITIONS[isEditionId(id) ? id : DEFAULT_EDITION]
}

// Loader for a front matter route: 404 when this edition has no such page.
// Routes that exist in every edition pass their slug; /pages/$slug passes
// the param.
export const editionPageLoader =
  (slug: string | ((params: Record<string, string | undefined>) => string)) =>
  ({ params }: { params: Record<string, string | undefined> }) => {
    const resolved = typeof slug === "function" ? slug(params) : slug
    const edition: EditionId = getEditionId()
    if (!EDITIONS[edition].pages[resolved]) {
      throw data(`No page "${resolved}" in ${EDITIONS[edition].shortName}`, {
        status: 404,
        statusText: "page-not-found",
      })
    }
    return { slug: resolved }
  }

export function EditionPage({ slug }: { slug: string }) {
  const edition = useEdition()
  const Page = edition.pages[slug]
  // The loader has already 404ed when the page is missing, so this only
  // guards against a slug the route forgot to declare.
  if (!Page) return null
  return <Page />
}
