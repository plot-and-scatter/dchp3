import { EditionPage, editionPageLoader } from "~/editions/EditionPage"

// The content lives in app/editions/<edition>/pages; this route only picks
// the page for the edition being served. See app/editions/index.tsx.
export const loader = editionPageLoader("about")

export default function Page() {
  return <EditionPage slug="about" />
}
