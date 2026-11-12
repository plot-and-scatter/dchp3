import { data } from "react-router"
import { getEditionId } from "./edition.server"
import { EDITIONS } from "./index"

// Loader for a front matter route: 404 when this edition has no such page.
// Routes that exist in every edition pass their slug; /pages/$slug passes
// the param. Server-only, so it lives apart from the EditionPage component,
// which the browser bundle also needs.
export const editionPageLoader =
  (slug: string | ((params: Record<string, string | undefined>) => string)) =>
  ({ params }: { params: Record<string, string | undefined> }) => {
    const resolved = typeof slug === "function" ? slug(params) : slug
    const edition = EDITIONS[getEditionId()]
    if (!edition.pages[resolved]) {
      throw data(`No page "${resolved}" in ${edition.shortName}`, {
        status: 404,
        statusText: "page-not-found",
      })
    }
    return { slug: resolved }
  }
