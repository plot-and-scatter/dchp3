import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import SanitizedTextSpan from "../Common/SanitizedTextSpan"
import TopLabelledField from "../../bank/TopLabelledField"
import Input from "../../bank/Input"
import clsx from "clsx"

interface generalLabelsProps {
  entry: LoadedEntryDataType
  isEditingMode?: boolean
}

const GeneralLabels = ({
  entry,
  isEditingMode,
}: generalLabelsProps): JSX.Element => {
  if (!isEditingMode && !entry?.general_labels) return <></>

  return (
    <div className={clsx(`mb-0`, isEditingMode && "w-full")}>
      {isEditingMode ? (
        <TopLabelledField
          label={<div className="text-base">General labels</div>}
          field={
            <Input
              name="generalLabels"
              className="italic"
              lightBorder
              defaultValue={entry.general_labels}
              placeholder="e.g. Fur Trade, Hist."
            />
          }
        />
      ) : (
        <span className="ml-3 italic">
          <SanitizedTextSpan text={entry?.general_labels} />
        </span>
      )}
    </div>
  )
}

export default GeneralLabels
