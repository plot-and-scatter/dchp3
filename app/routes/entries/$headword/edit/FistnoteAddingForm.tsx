import { Form } from "@remix-run/react"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import AddIcon from "~/components/elements/Icons/AddIcon"
import Button from "~/components/elements/LinksAndButtons/Button"

interface FistnoteAddingFormProps {
  meaningId: number
}

export default function FistnoteAddingForm({
  meaningId,
}: FistnoteAddingFormProps) {
  return (
    <Form method="post">
      <input type="hidden" name="meaningId" value={meaningId} />
      <input
        type="hidden"
        name="entryEditorFormAction"
        value={EntryEditorFormActionEnum.ADD_DEFINITION_FIST_NOTE}
      />
      <Button type="submit">
        <AddIcon /> Add fist note
      </Button>
    </Form>
  )
}
