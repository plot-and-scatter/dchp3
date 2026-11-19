import type { MetaFunction } from "react-router"
import { EDITIONS } from "~/editions"
import { DEFAULT_EDITION } from "~/editions/edition"
import { EditionPage } from "~/editions/EditionPage"
import { editionPageLoader } from "~/editions/editionPage.server"
import type { loader as rootLoader } from "~/root"

// The content lives in app/editions/<edition>/pages; this route only picks
// the page for the edition being served. See app/editions/index.tsx.
export const loader = editionPageLoader("home")

// A home page's title and description are what search engines show for the
// edition, so they spell the dictionary's name out for people who search by
// the full name and do not know the abbreviation. Every other page keeps the
// short name in its title and has no description.
export const meta: MetaFunction<typeof loader, { root: typeof rootLoader }> = ({
  matches,
}) => {
  const edition =
    matches.find((m) => m.id === "root")?.data?.edition ?? DEFAULT_EDITION
  const { homeTitle, homeDescription } = EDITIONS[edition]
  return [
    { title: homeTitle },
    { name: "description", content: homeDescription },
    { property: "og:title", content: homeTitle },
    { property: "og:description", content: homeDescription },
  ]
}

export default function Page() {
  return <EditionPage slug="home" />
}
