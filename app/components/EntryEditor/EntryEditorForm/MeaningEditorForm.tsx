import type { FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import type { EntryEditorFormActionEnum } from "./EntryEditorFormActionEnum"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type MeaningEditorFormProps = FormProps & {
  meaning: LoadedEntryDataType["meanings"][0]
  formAction: EntryEditorFormActionEnum
  headword: string
  children: React.ReactNode
  reloadDocument?: boolean
}

export default function MeaningEditorForm({
  children,
  formAction,
  headword,
  meaning,
  reloadDocument,
  ...rest
}: MeaningEditorFormProps) {
  const { id } = meaning

  return (
    <Form
      {...rest} // This line MUST come first!
      reloadDocument={reloadDocument}
      action={`/entries/${headword}/edit`}
      method="post"
    >
      <input type="hidden" name="meaningId" value={id} />
      <input type="hidden" name="entryEditorFormAction" value={formAction} />
      {children}
    </Form>
  )
}
