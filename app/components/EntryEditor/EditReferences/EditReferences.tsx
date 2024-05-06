import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import { Form } from "@remix-run/react"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import AddReference from "./AddReference"
import Button from "~/components/elements/LinksAndButtons/Button"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import EditIcon from "~/components/elements/Icons/EditIcon"
import EntryReference from "../EntryReference"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

interface EditReferencesProps {
  entry: LoadedEntryDataType
}

export default function EditReferences({ entry }: EditReferencesProps) {
  const references = entry.referenceLinks.sort((a, b) =>
    a.reference.short_display.localeCompare(b.reference.short_display)
  )

  return (
    <div className="my-12 rounded border border-gray-400 bg-gray-50 p-4 shadow-lg">
      <SecondaryHeader>
        <EditIcon /> Edit references
      </SecondaryHeader>
      <div className="space-y-2">
        {references.map((referenceLink, index) => {
          return (
            <div
              key={`see-also-${referenceLink.id}`}
              className="ml-2 flex flex-row items-center"
            >
              <EntryReference referenceLink={referenceLink} />
              <Form method="post" action={`/entries/${entry.headword}/edit`}>
                <input
                  type="hidden"
                  name="referenceId"
                  value={referenceLink.id}
                ></input>

                <input
                  type="hidden"
                  name="entryEditorFormAction"
                  value={EntryEditorFormActionEnum.DELETE_REFERENCE_LINK}
                ></input>
                <Button
                  type="submit"
                  size="small"
                  appearance="danger"
                  variant="outline"
                  className="ml-2"
                  onClick={(e) => {
                    if (
                      !confirm(
                        "Are you sure you want to unlink this reference?"
                      )
                    ) {
                      e.preventDefault()
                    }
                  }}
                >
                  <DeleteIcon className="mr-1" />
                  Unlink
                </Button>
              </Form>
            </div>
          )
        })}
        <div>
          <AddReference entry={entry} />
        </div>
      </div>
    </div>
  )
}
