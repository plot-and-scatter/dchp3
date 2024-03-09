import { EditingStatusTypeEnum } from "./EditingStatusTypeEnum"
import { EntryEditorFormActionEnum } from "../../EntryEditorForm/EntryEditorFormActionEnum"
import { Form } from "@remix-run/react"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import Button from "../../../elements/LinksAndButtons/Button"
import EditingStatusInput from "./EditingStatusInput"
import { Subheading1 } from "~/components/elements/Headings/Subheading1"
import { Subheading2 } from "~/components/elements/Headings/Subheading2"
import { TertiaryHeader } from "~/components/elements/Headings/TertiaryHeader"

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
    <Form
      reloadDocument
      action={`/entries/${entry.headword}/edit`}
      method="post"
    >
      <div className="flex flex-col">
        <TertiaryHeader>Editing status</TertiaryHeader>
        <div className="flex flex-col">
          {EDITING_STATUS_INPUTS.map((inputGrouping) => (
            <EditingStatusInput
              key={inputGrouping.type}
              {...inputGrouping}
              defaultChecked={entry[inputGrouping.type]}
            />
          ))}
        </div>
      </div>
      <input
        type="hidden"
        name="attributeType"
        value={EntryEditorFormActionEnum.EDITING_STATUS}
      />
      <input type="hidden" name="headword" value={entry.headword} />
      <Button variant="outline" size="small" className="mt-4 w-full">
        Save editing status
      </Button>
    </Form>
  )
}
