import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import SanitizedTextSpan from "../Common/SanitizedTextSpan"
import TopLabelledField from "../../bank/TopLabelledField"
import Input from "../../bank/Input"
import clsx from "clsx"

interface etymologyProps {
  entry: LoadedEntryDataType
  isEditingMode?: boolean
}

const Etymology = ({ entry, isEditingMode }: etymologyProps) => {
  if (!isEditingMode && !entry?.etymology) return <></>

  return (
    <div className={clsx(`mb-0`, isEditingMode && "w-full")}>
      {isEditingMode ? (
        <TopLabelledField
          label={<div className="text-base">Etymology</div>}
          field={
            <>
              <Input
                name="etymology"
                className="italic"
                lightBorder
                defaultValue={entry?.etymology}
                placeholder="e.g. [&lt; Canadian French <i>guichet</i> 'counter']"
              />
              {/* TODO: Come up with a note reminder of the use of HTML */}
              {/* <span className="text-xs text-gray-400">
                You can use HTML tags in this field
              </span> */}
            </>
          }
        />
      ) : (
        <span className="ml-3 italic">
          <SanitizedTextSpan text={entry?.etymology} />
        </span>
      )}
    </div>
  )
}

export default Etymology
