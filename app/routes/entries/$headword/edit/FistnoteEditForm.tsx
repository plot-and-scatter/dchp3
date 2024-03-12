import { type UsageNote } from "@prisma/client"
import { Form } from "@remix-run/react"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import HandNoteBlock from "~/components/HandNoteBlock"
import TextArea from "~/components/bank/TextArea"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import Button from "~/components/elements/LinksAndButtons/Button"

interface FistnoteEditFormProps {
  usageNote: UsageNote
}

export default function FistnoteEditForm({ usageNote }: FistnoteEditFormProps) {
  return (
    <Form method="post" className="flex items-start gap-x-4">
      <input
        type="hidden"
        name="entryEditorFormAction"
        value={EntryEditorFormActionEnum.DEFINITION_FIST_NOTE}
      />
      <input type="hidden" name="usageNoteId" value={usageNote.id} />
      <HandNoteBlock className="w-full text-lg">
        <TextArea
          name={"usageNoteText"}
          defaultValue={usageNote.text}
          className="w-full text-gray-900"
          lightBorder
          placeholder={"Enter fist note. To delete, clear the text and save."}
          rows={3}
        />
      </HandNoteBlock>

      <Button appearance="success" className="whitespace-nowrap">
        <SaveIcon /> Save fist note
      </Button>
    </Form>
  )
}
