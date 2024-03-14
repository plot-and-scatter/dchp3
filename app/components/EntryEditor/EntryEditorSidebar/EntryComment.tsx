import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import { useState } from "react"
import Button from "../../elements/LinksAndButtons/Button"
import EntryEditorForm from "../EntryEditorForm/EntryEditorForm"
import SaveIcon from "~/components/elements/Icons/SaveIcon"

interface EntryCommentProps {
  entry: LoadedEntryDataType
}

const EntryComment = ({ entry }: EntryCommentProps) => {
  let [comment, setComment] = useState(entry.comment)

  return (
    <EntryEditorForm
      entry={entry}
      formAction={EntryEditorFormActionEnum.COMMENT}
    >
      <div className="flex flex-col">
        <h3 className="text-xl">Comment</h3>
        <textarea
          className="h-40 border p-2"
          name="comment"
          onChange={(e) => setComment(e.target.value)}
          defaultValue={comment || ""}
          placeholder="Enter a comment"
        />
        <Button appearance="success" variant="outline" size="small">
          <SaveIcon /> Save comment
        </Button>
      </div>
    </EntryEditorForm>
  )
}

export default EntryComment
