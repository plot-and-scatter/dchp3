import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import Button from "~/components/elements/LinksAndButtons/Button"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import EditIcon from "~/components/elements/Icons/EditIcon"
import MeaningEditorForm from "../EntryEditorForm/MeaningEditorForm"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import type { MeaningType } from "~/components/Entry/Meanings/Meaning"

type EditMeaningHeaderProps = {
  entry: LoadedEntryDataType
  meaning: MeaningType
}

export default function EditMeaningHeader({
  entry,
  meaning,
}: EditMeaningHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-x-6">
        <SecondaryHeader noMargin>
          <div className="whitespace-nowrap">
            <EditIcon /> Edit meaning {meaning.order}
          </div>
        </SecondaryHeader>
        <div className="relative shrink">{meaning.definition}</div>
      </div>
      <MeaningEditorForm
        headword={entry.headword}
        meaning={meaning}
        formAction={EntryEditorFormActionEnum.DELETE_MEANING}
      >
        <Button
          type="submit"
          appearance="danger"
          variant="outline"
          className="whitespace-nowrap"
          onClick={(e) => {
            if (!confirm("Are you sure you want to delete this meaning?")) {
              e.preventDefault()
            }
          }}
        >
          <DeleteIcon /> Delete meaning
        </Button>
      </MeaningEditorForm>
    </div>
  )
}
