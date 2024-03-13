import { useFetcher } from "@remix-run/react"
import { useState } from "react"
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
const MAX_HEADWORDS_DISPLAYED = 500

export default function SeeAlsoInput({ name, ...rest }: SeeAlsoInputProps) {
  const [text, setText] = useState<string>()
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

  console.log("headwords.data", headwords.data)

  return (
    <div className="relative">
      <div className="flex">
        <TopLabelledField
          label="Headword to link"
          field={
            // <div className="flex items-center">
            //   <Input
            //     name={name}
            //     value={text}
            //     autoComplete="off"
            //     onChange={(event) => {
            //       setText(event.target.value)
            //       getHeadwords(event)
            //     }}
            //     className="w-full rounded border p-1"
            //     {...rest}
            //   />
            //   <div className="ml-2 w-6">
            //     {headwords.state === "loading" && (
            //       <i className="fas fa-spin fa-spinner" />
            //     )}
            //   </div>
            // </div>
            <Combobox
              options={
                headwords.data?.map((h) => ({
                  label: h.headword,
                  value: `${h.id}`,
                })) || []
              }
              onChange={(e) => {
                setText(e.target.value)
                getHeadwords(e)
              }}
              name="headword"
            />
          }
        />
      </div>
      {/* {showPopup && (
        <Popover
        hide
          title={
            <div className="flex items-center">
              <i className="fas fa-user mr-1 sm:mr-2" />
            </div>
          }
        >
          <div
            className="absolute h-64 w-96 overflow-y-auto rounded border border-gray-400 bg-gray-100 p-3 shadow"
            id="HeadwordPopup"
          >
            <strong>
              {headwords.data?.length} headwords starting with &ldquo;{text}
              &rdquo;
            </strong>
            <ul>
              {headwords.data?.map(
                (headword, index) =>
                  index < MAX_HEADWORDS_DISPLAYED && (
                    <li
                      onClick={() => setText(headword.headword)}
                      key={headword.id}
                      className="cursor-pointer p-1 hover:bg-gray-200"
                    >
                      {headword.headword}
                    </li>
                  )
              )}
              <AdditionalHeadwordCount length={headwords.data?.length || 0} />
            </ul>
          </div>
        </Popover>
      )} */}
    </div>
  )
}

// interface AdditionalHeadwordCountProps {
//   length: number
// }

// function AdditionalHeadwordCount({ length }: AdditionalHeadwordCountProps) {
//   return (
//     <>
//       {length - MAX_HEADWORDS_DISPLAYED > 0 && (
//         <li>
//           <i> ...{length - MAX_HEADWORDS_DISPLAYED} additional entries</i>
//         </li>
//       )}
//     </>
//   )
// }
