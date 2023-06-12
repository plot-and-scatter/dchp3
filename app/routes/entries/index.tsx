import { Link } from "@remix-run/react"

export const nonCanadianism = "Non-Canadian"
export const specialCharacter = "Special Characters"
const A_TO_Z = [...Array(26)].map((_, i) => String.fromCharCode(i + 65))
const nonLetterArray = [nonCanadianism, specialCharacter]

function getColumnSpan(letter: string) {
  const columnSpanPrefix = "col-span-"
  const span = nonLetterArray.includes(letter) ? 1 : 1

  return columnSpanPrefix + span
}

export default function EntryIndexPage() {
  const browseEntryArray = A_TO_Z.concat(nonLetterArray)

  return (
    <div>
      <h1 className="text-2xl font-bold">Browse entries</h1>
      <p>Select a letter below to browse entries starting with that letter.</p>
      <div className="my-5 grid grid-cols-9 gap-y-5">
        {A_TO_Z.map((letter) => (
          <div className={getColumnSpan(letter)} key={letter}>
            <Link
              className="text-xl font-bold text-red-600 hover:text-red-400"
              to={`/entries/browse/${letter}`}
            >
              {letter}
            </Link>
          </div>
        ))}
      </div>
      <div className="flex">
        {nonLetterArray.map((e) => (
          <div key={e}>
            <Link
              className="mx-5 text-xl font-bold text-red-600 hover:text-red-400"
              to={`/entries/browse/${e}`}
            >
              {e}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
