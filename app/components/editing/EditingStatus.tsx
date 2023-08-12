import { Form } from "@remix-run/react"
import { type LoadedDataType } from "~/routes/entries/$headword"
import { attributeEnum } from "./attributeEnum"

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

const EditingStatus = ({ data }: EditingStatusProps) => {
  return (
    <Form reloadDocument action={`/entries/${data.headword}`} method="post">
      <div className="flex flex-col">
        <h3 className="my-3 text-lg underline">Editing Status</h3>
        <label className="mx-2">
          First Draft
          <input
            name={EditingStatusType.FIRST_DRAFT}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          Revised Draft
          <input
            name={EditingStatusType.REVISED_DRAFT}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          Semant Revised
          <input
            name={EditingStatusType.SEMANT_REVISED}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          Edited For Style
          <input
            name={EditingStatusType.EDITED_FOR_STYLE}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          Chief Editor OK
          <input
            name={EditingStatusType.CHIEF_EDITOR_OK}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          No Cdn Susp.
          <input
            name={EditingStatusType.NO_CDN_SUSP}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          No Cdn Conf.
          <input
            name={EditingStatusType.NO_CDN_CONF}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          Copy-edited
          <input
            name={EditingStatusType.COPY_EDITED}
            className="m-2"
            type="checkbox"
          />
        </label>
        <label className="mx-2">
          Proofreading
          <input
            name={EditingStatusType.PROOF_READING}
            className="m-2"
            type="checkbox"
          />
        </label>
      </div>
      <input
        type="hidden"
        name="attributeType"
        value={attributeEnum.EDITING_STATUS}
      />
      <input type="hidden" name="headword" value={data.headword} />
      <button className="w-56 border bg-slate-500 hover:bg-slate-300">
        submit
      </button>
    </Form>
  )
}

export default EditingStatus
