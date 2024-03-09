import type { FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import type { EntryEditorFormActionEnum } from "./EntryEditorFormActionEnum"

type EntryEditorFormProps = FormProps & {
  headword: string
  formAction: EntryEditorFormActionEnum
  children: React.ReactNode
}

export default function EntryEditorForm({
  headword,
  children,
  formAction,
  ...rest
}: EntryEditorFormProps) {
  return (
    <Form
      {...rest} // This line MUST come first!
      reloadDocument={true}
      action={`/entries/${headword}/edit`}
      method="post"
    >
      <input type="hidden" name="entryEditorFormAction" value={formAction} />
      {children}
    </Form>
  )
}
