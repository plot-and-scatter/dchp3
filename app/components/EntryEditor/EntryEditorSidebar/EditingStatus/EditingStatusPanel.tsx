import { EditingStatusTypeEnum } from "./EditingStatusTypeEnum"
import { EntryEditorFormActionEnum } from "../../EntryEditorForm/EntryEditorFormActionEnum"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import Button from "../../../elements/LinksAndButtons/Button"
import EditingStatusInput from "./EditingStatusInput"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import { QuaternaryHeader } from "~/components/elements/Headings/QuaternaryHeader"
import EntryEditorForm from "../../EntryEditorForm/EntryEditorForm"

const EDITING_STATUS_INPUTS: { type: EditingStatusTypeEnum; label: string }[] =
  [
    {
      type: EditingStatusTypeEnum.FIRST_DRAFT,
      label: "First draft",
    },
    {
      type: EditingStatusTypeEnum.REVISED_DRAFT,
      label: "Revised draft",
    },
    {
      type: EditingStatusTypeEnum.SEMANT_REVISED,
      label: "Semantically revised",
    },
    {
      type: EditingStatusTypeEnum.EDITED_FOR_STYLE,
      label: "Edited for style",
    },
    {
      type: EditingStatusTypeEnum.CHIEF_EDITOR_OK,
      label: "Chief editor OK",
    },
    {
      type: EditingStatusTypeEnum.NO_CDN_SUSP,
      label: "Not Cdn. suspected",
    },
    {
      type: EditingStatusTypeEnum.NO_CDN_CONF,
      label: "Not Cdn. confirmed",
    },
    {
      type: EditingStatusTypeEnum.COPY_EDITED,
      label: "Copy-edited",
    },
    {
      type: EditingStatusTypeEnum.PROOF_READING,
      label: "Proofread",
    },
  ]

interface EditingStatusProps {
  entry: LoadedEntryDataType
}

export default function EditingStatusPanel({ entry }: EditingStatusProps) {
  return (
    <EntryEditorForm
      entry={entry}
      formAction={EntryEditorFormActionEnum.EDITING_STATUS}
      action={`/entries/${entry.headword}/edit`}
    >
      <div className="my-2 flex flex-col">
        <QuaternaryHeader>Editing status</QuaternaryHeader>
        <div className="-mt-2 flex flex-row flex-wrap">
          {EDITING_STATUS_INPUTS.map((inputGrouping) => (
            <EditingStatusInput
              key={inputGrouping.type}
              {...inputGrouping}
              defaultChecked={entry[inputGrouping.type]}
            />
          ))}
          <Button
            variant="outline"
            size="small"
            className="w-1/2"
            appearance="success"
          >
            <SaveIcon /> Save editing status
          </Button>
        </div>
      </div>
    </EntryEditorForm>
  )
}
