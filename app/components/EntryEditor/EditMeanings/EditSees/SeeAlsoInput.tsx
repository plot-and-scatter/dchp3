import { useFetcher } from "@remix-run/react"
import { useDebouncedCallback } from "use-debounce"
import TopLabelledField from "~/components/bank/TopLabelledField"
import Combobox from "~/components/elements/Combobox/Combobox"
import { resetFetcher } from "~/routes/api/reset-fetcher"

interface SeeAlsoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
}

const HEADWORD_DATA_URL = `/api/entries/headwords.json`
const DEBOUNCE_DELAY_IN_MS = 200
// const MAX_HEADWORDS_DISPLAYED = 500

export default function SeeAlsoInput({ name, ...rest }: SeeAlsoInputProps) {
  const headwords = useFetcher<{ id: number; headword: string }[]>()

  const getHeadwords = useDebouncedCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value
      if (text.length >= 2) {
        headwords.load(`${HEADWORD_DATA_URL}?startsWith=${text}&take=10000`)
      } else {
        resetFetcher(headwords)
      }
    },
    DEBOUNCE_DELAY_IN_MS
  )

  return (
    <div className="relative">
      <div className="flex">
        <TopLabelledField
          label="Headword to link"
          field={
            <Combobox
              options={
                headwords.data?.map((h) => ({
                  label: h.headword,
                  value: `${h.id}`,
                })) || []
              }
              onChange={(e) => {
                getHeadwords(e)
              }}
              placeholder="Start typing to search headwords"
              name="headword"
            />
          }
        />
      </div>
    </div>
  )
}
