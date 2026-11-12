import { useRouteLoaderData } from "react-router"
import type { loader as rootLoader } from "~/root"
import { DEFAULT_EDITION, isEditionId } from "./edition"
import { EDITIONS } from "./index"

// The edition the current request is being served for, read from the root
// loader. Components use this; server code uses getEditionId() directly.
export const useEdition = () => {
  const root = useRouteLoaderData<typeof rootLoader>("root")
  const id = root?.edition
  return EDITIONS[isEditionId(id) ? id : DEFAULT_EDITION]
}

export function EditionPage({ slug }: { slug: string }) {
  const edition = useEdition()
  const Page = edition.pages[slug]
  // The loader (editionPage.server.ts) has already 404ed when the page is
  // missing, so this only guards against a slug the route forgot to declare.
  if (!Page) return null
  return <Page />
}
