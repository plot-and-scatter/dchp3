import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import Button from "../../elements/LinksAndButtons/Button"
import EntryEditorForm from "../EntryEditorForm/EntryEditorForm"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import { QuaternaryHeader } from "~/components/elements/Headings/QuaternaryHeader"
import TextArea from "~/components/bank/TextArea"

interface EntryCommentProps {
  entry: LoadedEntryDataType
}

const EntryComment = ({ entry }: EntryCommentProps) => {
  return (
    <EntryEditorForm
      entry={entry}
      formAction={EntryEditorFormActionEnum.COMMENT}
    >
      <div className="flex flex-col">
        <QuaternaryHeader>Comment</QuaternaryHeader>
        <TextArea
          rows={8}
          name="comment"
          defaultValue={entry.comment}
          placeholder="Enter a comment"
          className="-mt-3"
        />
        <Button
          appearance="success"
          variant="outline"
          size="small"
          className="mt-2"
        >
          <SaveIcon /> Save comment
        </Button>
      </div>
    </EntryEditorForm>
  )
}

export default EntryComment
