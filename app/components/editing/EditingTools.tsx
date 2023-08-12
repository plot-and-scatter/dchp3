import { Form } from "@remix-run/react"
import { type LoadedDataType } from "~/routes/entries/$headword"
import { attributeEnum } from "./attributeEnum"

interface EditingToolsProps {
  data: LoadedDataType
}

const EditingTools = ({ data }: EditingToolsProps) => {
  return (
    <Form reloadDocument action={`/entries/${data.headword}`} method="post">
      <div className="flex flex-col">
        <h3 className="my-3 text-lg underline">Editing Tools</h3>
        <label className="mx-2">
          Publically Visible
          <input name="isPublic" className="m-2" type="checkbox" />
        </label>
        <label className="mx-2">
          Is Legacy
          <input name="isLegacy" className="m-2" type="checkbox" />
        </label>
        <input
          type="hidden"
          name="attributeType"
          value={attributeEnum.EDITING_TOOLS}
        />
        <input type="hidden" name="headword" value={data.headword} />
        <button className="w-56 border bg-slate-500 hover:bg-slate-300">
          submit
        </button>
      </div>
    </Form>
  )
}

export default EditingTools
