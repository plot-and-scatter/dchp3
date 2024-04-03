import EditMeanings from "~/components/EntryEditor/EditMeanings/EditMeanings"
import EntryEditorSidebar from "./EntryEditorSidebar/EntryEditorSidebar"
import Headword from "../Entry/Headword/Headword"
import ImageEditingForm from "~/components/EntryEditor/EditImages/ImageEditingForm"
import type { EntryEditLoaderData } from "~/routes/entries/$headword/edit"
import EditReferences from "./EditReferences/EditReferences"

export default function EntryEditor({ entry }: EntryEditLoaderData) {
  return (
    <div className="flex w-full flex-row items-start gap-4">
      <div className="fixed w-96 border border-gray-400 bg-gray-100 p-4 shadow">
        <EntryEditorSidebar entry={entry} />
      </div>
      {/* TODO: Remove temporary spacer */}
      <div className="w-0" />
      <div className="ml-96 flex-1">
        <div>
          <Headword entry={entry} isEditingMode />
          {/* <EntryEditingForm entry={entry} /> */}
        </div>
        <div className="mt-12">
          <EditMeanings data={entry} />
          <EditReferences entry={entry} />
          <ImageEditingForm data={entry} />
        </div>
      </div>
    </div>
  )
}
