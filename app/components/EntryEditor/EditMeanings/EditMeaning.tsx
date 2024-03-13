import { TertiaryHeader } from "~/components/elements/Headings/TertiaryHeader"
import AddSeeAlso from "./EditSees/AddSeeAlso"
import EditIcon from "~/components/elements/Icons/EditIcon"
import EditingPanel from "../EditorComponents/EditingPanel"
import EditMeaningFields from "./EditMeaningFields"
import EditMeaningHeader from "./EditMeaningHeader"
import FistnoteAddingForm from "./EditFistNotes/FistnoteAddingForm"
import FistnoteEditForm from "./EditFistNotes/FistnoteEditForm"
import QuotationAddingForm from "./EditQuotations/QuotationAddingForm"
import QuotationList from "./EditQuotations/QuotationList"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import type { MeaningType } from "~/components/Entry/Meanings/Meaning"
import SeeAlsoItems from "./EditSees/EditSees"

interface EditMeaningProps {
  entry: LoadedEntryDataType
  meaning: MeaningType
}

export default function EditMeaning({ entry, meaning }: EditMeaningProps) {
  const headword = entry.headword

  return (
    <EditingPanel
      header={<EditMeaningHeader entry={entry} meaning={meaning} />}
    >
      <EditMeaningFields entry={entry} meaning={meaning} />

      <div className="mt-8 rounded border border-gray-400 bg-red-50 p-4 shadow">
        <TertiaryHeader>
          <EditIcon /> Edit sees
        </TertiaryHeader>
        <SeeAlsoItems headword={headword} seeAlsoItems={meaning.seeAlso} />
        <AddSeeAlso headword={headword} meaning={meaning} />
      </div>

      <div className="mt-8 rounded border border-gray-400 bg-action-50 p-4 shadow">
        <TertiaryHeader>
          <EditIcon /> Edit fist notes
        </TertiaryHeader>

        <div className="mb-4">
          {meaning.usageNotes.map((usageNote) => (
            <div key={`usage-note-div-${usageNote.id}`} className="mb-2">
              <FistnoteEditForm usageNote={usageNote} />
            </div>
          ))}
        </div>
        <FistnoteAddingForm headword={headword} meaning={meaning} />
      </div>

      <div className="mt-8 rounded border border-gray-400 bg-amber-50 p-4">
        <TertiaryHeader>
          <span className="text-amber-600">
            <EditIcon /> Edit quotations
          </span>
        </TertiaryHeader>
        <QuotationList meaningId={meaning.id} citations={meaning.citations} />
        <QuotationAddingForm meaningId={meaning.id} />
      </div>
    </EditingPanel>
  )
}
