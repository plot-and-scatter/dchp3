import { Form } from "@remix-run/react"
import { type LoadedDataType } from "~/routes/entries/$headword"
import { attributeEnum } from "./attributeEnum"
import { useState } from "react"
import Button from "../elements/LinksAndButtons/Button"

interface EditingStatusProps {
  data: LoadedDataType
}

export enum EditingStatusType {
  FIRST_DRAFT = "firstDraft",
  REVISED_DRAFT = "revisedDraft",
  SEMANT_REVISED = "semantRevised",
  EDITED_FOR_STYLE = "editedForStyle",
  CHIEF_EDITOR_OK = "chiefEditorOk",
  NO_CDN_SUSP = "noCdnSusp",
  NO_CDN_CONF = "noCdnConf",
  COPY_EDITED = "copyEdited",
  PROOF_READING = "proofReading",
}

interface grouping {
  type: EditingStatusType
  label: string
  checked: boolean
}

const EditingStatus = ({ data }: EditingStatusProps) => {
  return (
    <Form
      reloadDocument
      action={`/entries/${data.headword}/edit`}
      method="post"
    >
      <div className="flex flex-col">
        <h3 className="my-3 text-lg underline">Editing Status</h3>
        {getEditingStatusInputs(data)}
      </div>
      <input
        type="hidden"
        name="attributeType"
        value={attributeEnum.EDITING_STATUS}
      />
      <input type="hidden" name="headword" value={data.headword} />
      <Button
        appearance="primary"
        variant="outline"
        size="small"
        className="mt-4"
      >
        Save editing status
      </Button>
    </Form>
  )
}

export default EditingStatus
function getEditingStatusInputs(data: LoadedDataType) {
  const firstDraft: grouping = {
    type: EditingStatusType.FIRST_DRAFT,
    label: "First Draft",
    checked: data.first_draft,
  }

  const revisedDraft: grouping = {
    type: EditingStatusType.REVISED_DRAFT,
    label: "Revised Draft",
    checked: data.revised_draft,
  }

  const semanticallyRevised: grouping = {
    type: EditingStatusType.SEMANT_REVISED,
    label: "Semantically Revised",
    checked: data.semantically_revised,
  }

  const editedForStyle: grouping = {
    type: EditingStatusType.EDITED_FOR_STYLE,
    label: "Edited For Style",
    checked: data.edited_for_style,
  }

  const chiefEditorOk: grouping = {
    type: EditingStatusType.CHIEF_EDITOR_OK,
    label: "Chief Editor OK",
    checked: data.chief_editor_ok,
  }

  const noCdnSusp: grouping = {
    type: EditingStatusType.NO_CDN_SUSP,
    label: "No Cdn Susp",
    checked: data.no_cdn_susp,
  }

  const noCdnConf: grouping = {
    type: EditingStatusType.NO_CDN_CONF,
    label: "No Cdn Conf",
    checked: data.no_cdn_conf,
  }

  const copyEdited: grouping = {
    type: EditingStatusType.COPY_EDITED,
    label: "Copy-Edited",
    checked: data.final_proofing, // TODO: Verify this is the same as what we want
  }

  const proofReading: grouping = {
    type: EditingStatusType.PROOF_READING,
    label: "Proof-reading",
    checked: data.proofread, // verify this is what we want
  }

  let inputs: Array<grouping> = []
  inputs.push(firstDraft)
  inputs.push(revisedDraft)
  inputs.push(semanticallyRevised)
  inputs.push(editedForStyle)
  inputs.push(chiefEditorOk)
  inputs.push(noCdnSusp)
  inputs.push(noCdnConf)
  inputs.push(copyEdited)
  inputs.push(proofReading)

  const inputsJsx = inputs.map((inputGrouping) => {
    const [checked, setChecked] = useState(inputGrouping.checked)

    return (
      <label key={"Editing Status - " + inputGrouping.label} className="mx-2">
        {inputGrouping.label}
        <input
          name={inputGrouping.type}
          className="m-1"
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked)
          }}
        />
      </label>
    )
  })

  return inputsJsx
}
