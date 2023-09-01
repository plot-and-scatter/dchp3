import { resetFetcher } from "~/routes/api/reset-fetcher"
import { useDebouncedCallback } from "use-debounce"
import { useFetcher } from "@remix-run/react"
import BankInput from "../bank/BankInput"

const HEADWORD_DATA_URL = `/api/entries/headwords.json`

const DEBOUNCE_DELAY_IN_MS = 200

export default function HeadwordAutocomplete() {
  const headwords = useFetcher<{ id: number; headword: string }[]>()

  const onChangeAction = useDebouncedCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value
      if (text.length >= 2) {
        headwords.load(`${HEADWORD_DATA_URL}?startsWith=${text}`)
      } else {
        resetFetcher(headwords)
      }
    },
    DEBOUNCE_DELAY_IN_MS
  )

  return (
    <div className="w-96">
      <div className="flex">
        <div className="w-72">
          <BankInput
            placeholder="Enter text to search entry headwords"
            name="headwords"
            onChange={onChangeAction}
          />
        </div>
        <div className="w-24">
          {headwords.state === "loading" && <div>Loading...</div>}
        </div>
      </div>
      {headwords.data && (
        <>
          <strong>{headwords.data.length} headwords</strong>
          <ul>
            {headwords.data.map((headword) => (
              <li key={headword.id}>{headword.headword}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
