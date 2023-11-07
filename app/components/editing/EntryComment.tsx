import { Form } from "@remix-run/react"
import { useState } from "react"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import { attributeEnum } from "./attributeEnum"
import Button from "../elements/LinksAndButtons/Button"

interface EntryCommentProps {
  data: LoadedEntryDataType
}

const EntryComment = ({ data }: EntryCommentProps) => {
  let [comment, setComment] = useState(data.comment)

  return (
    <Form
      reloadDocument
      action={`/entries/${data.headword}/edit`}
      method="post"
    >
      <div className="flex flex-col">
        <h3 className="text-xl underline">Comment</h3>
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
          value={attributeEnum.COMMENT}
        />
        <input type="hidden" name="headword" value={data.headword} />
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
