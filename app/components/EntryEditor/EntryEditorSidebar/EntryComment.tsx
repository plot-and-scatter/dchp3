import { Form } from "@remix-run/react"
import { useState } from "react"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import Button from "../../elements/LinksAndButtons/Button"

interface EntryCommentProps {
  entry: LoadedEntryDataType
}

const EntryComment = ({ entry }: EntryCommentProps) => {
  let [comment, setComment] = useState(entry.comment)

  return (
    <Form
      reloadDocument
      action={`/entries/${entry.headword}/edit`}
      method="post"
    >
      <div className="flex flex-col">
        <h3 className="text-xl">Comment</h3>
        <textarea
          className="h-40 border p-2"
          name="comment"
          onChange={(e) => setComment(e.target.value)}
        >
          {comment}
        </textarea>
        <input
          type="hidden"
          name="attributeType"
          value={EntryEditorFormActionEnum.COMMENT}
        />
        <input type="hidden" name="headword" value={entry.headword} />
        <Button
          appearance="primary"
          variant="outline"
          size="small"
          className="mt-4"
        >
          Apply Comment
        </Button>
      </div>
    </Form>
  )
}

export default EntryComment
