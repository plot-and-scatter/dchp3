import type { Reference } from "@prisma/client"
import { useFetcher } from "@remix-run/react"
import { useDebouncedCallback } from "use-debounce"
import TopLabelledField from "~/components/bank/TopLabelledField"
import Combobox from "~/components/elements/Combobox/Combobox"
import { resetFetcher } from "~/routes/api/reset-fetcher"

interface ReferenceComboboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
}

const HEADWORD_DATA_URL = `/api/references/referenceList.json`
const DEBOUNCE_DELAY_IN_MS = 200
// const MAX_HEADWORDS_DISPLAYED = 500

export default function ReferenceCombobox({
  name,
  ...rest
}: ReferenceComboboxProps) {
  const references = useFetcher<Reference[]>()

  const getReferences = useDebouncedCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value
      if (text.length >= 2) {
        references.load(`${HEADWORD_DATA_URL}?containsText=${text}`)
      } else {
        resetFetcher(references)
      }
    },
    DEBOUNCE_DELAY_IN_MS
  )

  return (
    <div className="relative w-full">
      <TopLabelledField
        label="Reference to link"
        field={
          <Combobox
            options={
              references.data?.map((r) => ({
                label: `<b>${r.short_display}</b> (${r.reference_text})`,
                value: `${r.id}`,
              })) || []
            }
            onChange={(e) => {
              getReferences(e)
            }}
            placeholder="Start typing to search references"
            name={name}
          />
        }
      />
    </div>
  )
}
