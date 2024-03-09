import { PageHeader } from "../elements/Headings/PageHeader"
import EntryEditingForm from "~/routes/entries/$headword/edit/EntryEditingForm"
import EntryEditorSidebar from "./EntryEditorSidebar/EntryEditorSidebar"
import ImageEditingForm from "~/routes/entries/$headword/edit/ImageEditingForm"
import MeaningEditingForms from "~/routes/entries/$headword/edit/MeaningEditingForms"
import type { EntryEditLoaderData } from "~/routes/entries/$headword/edit"

export default function EntryEditor({ entry }: EntryEditLoaderData) {
  return (
    <div className="flex w-full flex-row">
      <div className="w-1/4">
        <EntryEditorSidebar entry={entry} />
      </div>
      <div className="w-3/4">
        <PageHeader>Edit headword: {entry.headword}</PageHeader>
        <EntryEditingForm data={entry} />
        <MeaningEditingForms data={entry} />
        <ImageEditingForm data={entry} />
      </div>
    </div>
  )
}
