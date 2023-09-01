import { useFetcher } from "@remix-run/react"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { resetFetcher } from "~/routes/api/reset-fetcher"

interface SeeAlsoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
}

const HEADWORD_DATA_URL = `/api/entries/headwords.json`
const DEBOUNCE_DELAY_IN_MS = 200
const MAX_HEADWORDS_DISPLAYED = 10

export default function SeeAlsoInput({ name, ...rest }: SeeAlsoInputProps) {
  const [text, setText] = useState<string>()
  const headwords = useFetcher<{ id: number; headword: string }[]>()

  const getHeadwords = useDebouncedCallback(
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

  const onChangeFunctions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
    getHeadwords(event)
  }

  return (
    <div className="w-96">
      <div className="flex">
        <div className="w-72">
          <input
            name={name}
            value={text}
            onChange={onChangeFunctions}
            className="mx-2 rounded border p-1"
            {...rest}
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
            {headwords.data.map(
              (headword, index) =>
                index < MAX_HEADWORDS_DISPLAYED && (
                  <li
                    onClick={() => setText(headword.headword)}
                    key={headword.id}
                  >
                    {headword.headword}
                  </li>
                )
            )}
            <AdditionalHeadwordCount length={headwords.data.length} />
          </ul>
        </>
      )}
    </div>
  )
}

interface AdditionalHeadwordCountProps {
  length: number
}

function AdditionalHeadwordCount({ length }: AdditionalHeadwordCountProps) {
  return (
    <>
      {length - MAX_HEADWORDS_DISPLAYED > 0 && (
        <li>
          <i> ...{length - MAX_HEADWORDS_DISPLAYED} additional entries</i>
        </li>
      )}
    </>
  )
}
