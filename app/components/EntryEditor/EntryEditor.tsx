import EntryEditorSidebar from "./EntryEditorSidebar/EntryEditorSidebar"
import Headword from "../headwordComponents/Headword"
import ImageEditingForm from "~/routes/entries/$headword/edit/ImageEditingForm"
import MeaningEditingForms from "~/routes/entries/$headword/edit/MeaningEditingForms"
import type { EntryEditLoaderData } from "~/routes/entries/$headword/edit"
import { Link } from "../elements/LinksAndButtons/Link"
import BackIcon from "../elements/Icons/BackIcon"

export default function EntryEditor({ entry }: EntryEditLoaderData) {
  return (
    <div className="flex w-full flex-row gap-4">
      <div className="w-96 bg-gray-300">
        <EntryEditorSidebar entry={entry} />
      </div>
      <div className="flex-1">
        <div className="mb-8">
          <Link
            bold
            to={`/entries/${entry.headword}`}
            className="w-fit text-xl"
            appearance="secondary"
          >
            <BackIcon /> Return to entry
          </Link>
        </div>
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
  )
}
