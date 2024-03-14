import type { FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import type { EntryEditorFormActionEnum } from "./EntryEditorFormActionEnum"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type EntryEditorFormProps = FormProps & {
  entry: LoadedEntryDataType
  formAction: EntryEditorFormActionEnum
  children: React.ReactNode
  reloadDocument?: boolean
}

export default function EntryEditorForm({
  children,
  formAction,
  entry,
  reloadDocument,
  ...rest
}: EntryEditorFormProps) {
  const { headword, id } = entry

  return (
    <Form
      {...rest} // This line MUST come first!
      reloadDocument={reloadDocument}
      action={`/entries/${headword}/edit`}
      method="post"
    >
      <input type="hidden" name="entryId" value={id} />
      <input type="hidden" name="entryEditorFormAction" value={formAction} />
      {children}
    </Form>
  )
}
