import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { Form } from "@remix-run/react"
import Button from "~/components/elements/LinksAndButtons/Button"
import SeeAlsoInput from "./SeeAlsoInput"

interface AddSeeAlsoProps {
  meaningId: number
  headword: string
}

export default function AddSeeAlso({ meaningId, headword }: AddSeeAlsoProps) {
  return (
    <Form
      method="post"
      className="my-2 flex flex-row items-center justify-between border bg-gray-100 p-5"
    >
      <div className="flex">
        <input type="hidden" name="meaningId" value={meaningId} />
        <label className="mx-2 p-1">New See Also:</label>
        <SeeAlsoInput name="headwordToAdd" />
        <label htmlFor="linkNote" className="mx-2 p-1">
          See Also Comment:
        </label>
        <input name="linkNote" className="mx-2 h-9 w-auto rounded border p-1" />
      </div>
      <Button
        type="submit"
        size="medium"
        name="attributeType"
        value={EntryEditorFormActionEnum.ADD_SEE_ALSO}
        className="mx-2"
      >
        Add See Also
      </Button>
    </Form>
  )
}
