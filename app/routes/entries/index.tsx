import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"

export const A_TO_Z = [...Array(26)].map((_, i) => String.fromCharCode(i + 65))

export default function EntryIndexPage() {
  return (
    <div>
      <PageHeader>Browse entries</PageHeader>
      <p>Select a letter below to browse entries starting with that letter.</p>
      <div className="mt-5 grid grid-cols-9 gap-y-5">
        {A_TO_Z.map((letter) => (
          <div key={letter}>
            <Link bold to={`/entries/browse/${letter}`} className="text-2xl">
              {letter}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
