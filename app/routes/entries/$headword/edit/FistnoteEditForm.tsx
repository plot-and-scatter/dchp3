import { type UsageNote } from "@prisma/client"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { attributeEnum } from "~/components/editing/attributeEnum"
import Button from "~/components/elements/LinksAndButtons/Button"

interface FistnoteEditFormProps {
  index: number
  usageNote: UsageNote
}

export default function FistnoteEditForm({
  index,
  usageNote,
}: FistnoteEditFormProps) {
  let [usageNoteText, setText] = useState(usageNote.text)
  return (
    <Form method="post" className="">
      <label htmlFor="usageNoteText" className="text-lg">
        Fistnote {index}:
      </label>
      <textarea
        name="usageNoteText"
        value={usageNoteText}
        onChange={(e) => setText(e.target.value)}
        className="m-1 h-16 w-full border bg-gray-50 p-1"
      />
      <input
        type="hidden"
        name="attributeType"
        value={attributeEnum.DEFINITION_FIST_NOTE}
      />
      <input type="hidden" name="usageNoteId" value={usageNote.id} />
      <Button> submit </Button>
    </Form>
  )
}
