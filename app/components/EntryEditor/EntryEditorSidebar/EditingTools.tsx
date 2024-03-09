import { Form } from "@remix-run/react"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import { useState } from "react"
import Button from "../../elements/LinksAndButtons/Button"
import { TertiaryHeader } from "../../elements/Headings/TertiaryHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"

interface EditingToolsProps {
  entry: LoadedEntryDataType
}

const EditingTools = ({ entry }: EditingToolsProps) => {
  const [isPublic, setIsPublic] = useState(entry.is_public)
  const [isLegacy, setIsLegacy] = useState(entry.is_legacy)

  return (
    <Form
      reloadDocument
      action={`/entries/${entry.headword}/edit`}
      method="post"
    >
      <div className="flex flex-col">
        <SecondaryHeader>Editing tools</SecondaryHeader>
        <div>
          <label>
            Publicly visible
            <input
              name="isPublic"
              className="m-1"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </label>
          <label className="mx-2">
            Is legacy
            <input
              name="isLegacy"
              className="m-1"
              type="checkbox"
              checked={isLegacy}
              onChange={(e) => setIsLegacy(e.target.checked)}
            />
          </label>
        </div>
        <input
          type="hidden"
          name="attributeType"
          value={EntryEditorFormActionEnum.EDITING_TOOLS}
        />
        <input type="hidden" name="headword" value={entry.headword} />
        <Button variant="outline" size="small" className="w-full">
          Save editing tools
        </Button>
      </div>
    </Form>
  )
}

export default EditingTools
