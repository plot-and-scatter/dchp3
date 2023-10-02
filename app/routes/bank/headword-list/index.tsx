import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/PageHeader"
import { A_TO_Z } from "~/routes/entries/index"

export default function HeadwordListIndexPage() {
  return (
    <div>
      <PageHeader>Browse headwords</PageHeader>
      <p>
        Select a letter below to browse headwords starting with that letter.
      </p>
      <div className="mt-5 grid grid-cols-9 gap-y-5">
        {A_TO_Z.map((letter) => (
          <div key={letter}>
            <Link
              bold
              to={`/bank/headword-list/${letter}`}
              className="text-2xl"
            >
              {letter}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
