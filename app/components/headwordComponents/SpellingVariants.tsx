import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import SanitizedTextSpan from "../SanitizedTextSpan"
import Input from "../bank/Input"

interface alternativesProps {
  entry: LoadedEntryDataType
  isEditingMode?: boolean
}

const SpellingVariants = ({
  entry,
  isEditingMode,
}: alternativesProps): JSX.Element => {
  if (!isEditingMode && !entry?.spelling_variants) return <></>

  return (
    <h2 className="flex items-center leading-tight text-gray-700 md:text-xl">
      <div className="text-gray-500">Spelling variants:</div>
      <div className="ml-1 flex-1 italic">
        {isEditingMode ? (
          <Input
            name="spellingVariant"
            className="italic text-gray-900"
            lightBorder
            defaultValue={entry?.spelling_variants}
            placeholder="e.g. Kanuck, kanaka"
          />
        ) : (
          <SanitizedTextSpan text={entry?.spelling_variants} />
        )}
      </div>
    </h2>
  )
}

export default SpellingVariants
