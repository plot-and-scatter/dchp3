import EntryEditorSidebar from "./EntryEditorSidebar/EntryEditorSidebar"
import Headword from "../headwordComponents/Headword"
import ImageEditingForm from "~/routes/entries/$headword/edit/ImageEditingForm"
import MeaningEditingForms from "~/routes/entries/$headword/edit/MeaningEditingForms"
import type { EntryEditLoaderData } from "~/routes/entries/$headword/edit"

export default function EntryEditor({ entry }: EntryEditLoaderData) {
  return (
    <div>
      <div className="flex flex-row gap-4">
        <div className="w-96 max-w-2xl bg-gray-300">
          <EntryEditorSidebar entry={entry} />
        </div>
        <div className="flex-1 md:max-w-2xl lg:max-w-6xl">
          <div>
            <Headword entry={entry} isEditingMode />
            {/* <EntryEditingForm entry={entry} /> */}
          </div>
          <div className="mt-8">
            <MeaningEditingForms data={entry} />
            <ImageEditingForm data={entry} />
          </div>
        </div>
      </div>
    </div>
  )
}
