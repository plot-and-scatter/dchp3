import { Form } from "@remix-run/react"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import { attributeEnum } from "./attributeEnum"
import { useState } from "react"
import Button from "../elements/LinksAndButtons/Button"

interface EditingToolsProps {
  data: LoadedEntryDataType
}

const EditingTools = ({ data }: EditingToolsProps) => {
  const [isPublic, setIsPublic] = useState(data.is_public)
  const [isLegacy, setIsLegacy] = useState(data.is_legacy)

  return (
    <Form
      reloadDocument
      action={`/entries/${data.headword}/edit`}
      method="post"
    >
      <div className="flex flex-col">
        <h3 className="my-2 text-lg underline">Editing Tools</h3>
        <div>
          <label className="mx-2">
            Publically Visible
            <input
              name="isPublic"
              className="m-1"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </label>
          <label className="mx-2">
            Is Legacy
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
          value={attributeEnum.EDITING_TOOLS}
        />
        <input type="hidden" name="headword" value={data.headword} />
        <Button variant="outline" size="small" className="w-full">
          Save editing tools
        </Button>
      </div>
    </Form>
  )
}

export default EditingTools
