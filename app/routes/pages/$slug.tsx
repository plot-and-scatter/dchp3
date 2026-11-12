import { useLoaderData } from "react-router"
import { EditionPage, editionPageLoader } from "~/editions/EditionPage"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"

// Front matter pages an edition has beyond the shared home, about and
// how-to-use: DCHP-1's 1967 frontmatter, abbreviations and copyright notice.
// Unknown slugs 404 from the loader.
export const loader = editionPageLoader((params) => params.slug ?? "")

export default function ExtraPage() {
  const { slug } = useLoaderData<typeof loader>()
  return <EditionPage slug={slug} />
}

export const ErrorBoundary = DefaultErrorBoundary
