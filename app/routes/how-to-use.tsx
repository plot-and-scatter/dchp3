import { EditionPage } from "~/editions/EditionPage"
import { editionPageLoader } from "~/editions/editionPage.server"

// The content lives in app/editions/<edition>/pages; this route only picks
// the page for the edition being served. See app/editions/index.tsx.
export const loader = editionPageLoader("how-to-use")

export default function Page() {
  return <EditionPage slug="how-to-use" />
}
