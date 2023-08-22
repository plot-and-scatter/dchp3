import { Link } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"

const A_TO_Z = [...Array(26)].map((_, i) => String.fromCharCode(i + 65))

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
              className="text-xl font-bold text-red-600 hover:text-red-400"
              to={`/bank/headword-list/${letter}`}
            >
              {letter}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}