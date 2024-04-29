import type { FormProps } from "@remix-run/react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import type { EntryEditorFormActionEnum } from "./EntryEditorFormActionEnum"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import { useRef, useEffect } from "react"
import type { action } from "~/routes/entries/$headword/edit"

type MeaningEditorFormProps = FormProps & {
  meaning: LoadedEntryDataType["meanings"][0]
  formAction: EntryEditorFormActionEnum
  headword: string
  children: React.ReactNode
  reloadDocument?: boolean
  resetOnSuccess?: boolean
}

export default function MeaningEditorForm({
  children,
  formAction,
  headword,
  meaning,
  reloadDocument,
  resetOnSuccess,
  ...rest
}: MeaningEditorFormProps) {
  const { id } = meaning

  let formRef = useRef<HTMLFormElement>(null)
  let navigation = useNavigation()
  let actionData = useActionData<typeof action>()

  useEffect(
    // Reset form on success
    function resetFormOnSuccess() {
      if (
        resetOnSuccess &&
        navigation.state === "idle" &&
        actionData?.status === "success"
      ) {
        formRef.current?.reset()
      }
    },
    [navigation.state, actionData, resetOnSuccess]
  )

  return (
    <Form
      {...rest} // This line MUST come first!
      reloadDocument={reloadDocument}
      action={`/entries/${headword}/edit`}
      method="post"
      ref={formRef}
    >
      <input type="hidden" name="meaningId" value={id} />
      <input type="hidden" name="entryEditorFormAction" value={formAction} />
      {children}
    </Form>
  )
}
