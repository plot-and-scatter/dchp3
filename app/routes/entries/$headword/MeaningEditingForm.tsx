import { Form } from "@remix-run/react"
import { type MeaningType } from "~/components/Meaning"
import { attributeEnum } from "~/components/editing/attributeEnum"
import Button from "~/components/elements/Button"

interface MeaningEditingFormProps {
  headword: string
  meaning: MeaningType
}

export default function MeaningEditingForm({
  headword,
  meaning,
}: MeaningEditingFormProps) {
  return (
    <Form method="post">
      <input type="hidden" name="attributeType" value={attributeEnum.MEANING} />
      <input type="hidden" name="id" value={meaning.id} />
      <input type="hidden" name="headword" value={headword} />
      <Button type="submit" size="medium">
        Update Meaning
      </Button>
    </Form>
  )
}
