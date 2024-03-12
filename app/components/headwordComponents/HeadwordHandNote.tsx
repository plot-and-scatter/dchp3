import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import HandNoteBlock from "../EntryEditor/HandNoteBlock"
import SanitizedTextSpan from "../EntryEditor/SanitizedTextSpan"
import TextArea from "../bank/TextArea"

type HeadwordHandNoteProps = {
  entry: LoadedEntryDataType
  isEditingMode?: boolean
}

export default function HeadwordHandNote({
  entry,
  isEditingMode,
}: HeadwordHandNoteProps) {
  if (!isEditingMode) {
    return (
      <>
        {entry.fist_note && (
          <HandNoteBlock className="text-xs text-gray-500 md:text-lg">
            <SanitizedTextSpan text={entry.fist_note} />
          </HandNoteBlock>
        )}
      </>
    )
  }

  return (
    <HandNoteBlock className="w-full text-xs md:text-lg">
      <TextArea
        name={"fistNote"}
        defaultValue={entry.fist_note}
        className="w-full text-gray-900"
        lightBorder
        placeholder={"Enter fist note"}
      />
    </HandNoteBlock>
  )
}
