import type { FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import type { EntryEditorFormActionEnum } from "./EntryEditorFormActionEnum"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type MeaningEditorFormProps = FormProps & {
  meaning: LoadedEntryDataType["meanings"][0]
  formAction: EntryEditorFormActionEnum
  headword: string
  children: React.ReactNode
}

export default function MeaningEditorForm({
  children,
  formAction,
  headword,
  meaning,
  ...rest
}: MeaningEditorFormProps) {
  const { id } = meaning

  return (
    <Form
      {...rest} // This line MUST come first!
      reloadDocument={true}
      action={`/entries/${headword}/edit`}
      method="post"
    >
      <input type="hidden" name="meaningId" value={id} />
      <input type="hidden" name="entryEditorFormAction" value={formAction} />
      {children}
    </Form>
  )
}
