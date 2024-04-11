import { useState } from "react"
import EntryEditorForm from "~/components/EntryEditor/EntryEditorForm/EntryEditorForm"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import Input from "~/components/bank/Input"
import TopLabelledField from "~/components/bank/TopLabelledField"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

const PERMANENTLY_DELETE_TEXT = "permanently delete"

type HeadwordDeleteButtonProps = {
  entry: LoadedEntryDataType
}

export default function HeadwordDeleteButton({
  entry,
}: HeadwordDeleteButtonProps) {
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const canPermanentlyDelete = deleteConfirmation === PERMANENTLY_DELETE_TEXT

  if (!showDeleteForm) {
    return (
      <Button
        appearance="danger"
        variant="outline"
        onClick={() => {
          setShowDeleteForm(true)
        }}
      >
        <DeleteIcon /> Delete headword
      </Button>
    )
  }

  return (
    <div className="flex items-end gap-x-2">
      <Input
        className="w-80"
        name="permanently-delete-confirmation"
        placeholder={`Type "${PERMANENTLY_DELETE_TEXT}" to confirm`}
        onChange={(e) => {
          setDeleteConfirmation(e.target.value)
        }}
      />
      <EntryEditorForm
        entry={entry}
        formAction={EntryEditorFormActionEnum.DELETE_ENTRY}
      >
        <Button
          appearance="danger"
          variant="outline"
          onClick={(e) => {
            if (!canPermanentlyDelete) {
              e.preventDefault()
              return
            }
            if (
              !confirm(
                "Are you sure you want to permanently delete this headword and all its meanings? This action CANNOT be undone."
              )
            ) {
              e.preventDefault()
            }
          }}
          className={"whitespace-nowrap"}
          disabled={!canPermanentlyDelete}
        >
          <DeleteIcon /> Delete headword
        </Button>
      </EntryEditorForm>
      <Button
        appearance="primary"
        variant="outline"
        onClick={() => {
          setShowDeleteForm(false)
          setDeleteConfirmation("")
        }}
      >
        <FAIcon iconName="fa-times" />
        Cancel
      </Button>
    </div>
  )
}
