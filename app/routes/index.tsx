import type { MetaFunction } from "react-router"
import { EDITIONS } from "~/editions"
import { DEFAULT_EDITION } from "~/editions/edition"
import { EditionPage } from "~/editions/EditionPage"
import { editionPageLoader } from "~/editions/editionPage.server"
import { SITE_NAME, type loader as rootLoader } from "~/root"

// The content lives in app/editions/<edition>/pages; this route only picks
// the page for the edition being served. See app/editions/index.tsx.
export const loader = editionPageLoader("home")

// The DCHP-3 home page is the home page of the whole site, and its title is
// the heading search engines show for the site. It spells the name out for
// people who search for the dictionary by its full name and do not know the
// abbreviation. An archive's home page keeps its short name ("DCHP-2").
export const HOME_TITLE = `${SITE_NAME} | Dictionary of Canadianisms on Historical Principles`

export const meta: MetaFunction<typeof loader, { root: typeof rootLoader }> = ({
  matches,
}) => {
  const edition =
    matches.find((m) => m.id === "root")?.data?.edition ?? DEFAULT_EDITION
  return [
    {
      title:
        edition === DEFAULT_EDITION ? HOME_TITLE : EDITIONS[edition].shortName,
    },
  ]
}

export default function Page() {
  return <EditionPage slug="home" />
}
