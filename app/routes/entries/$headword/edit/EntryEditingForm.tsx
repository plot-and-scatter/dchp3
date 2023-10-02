import { Form } from "@remix-run/react"
import { useState } from "react"
import { type LoadedDataType } from ".."
import Button from "~/components/elements/LinksAndButtons/Button"
import { attributeEnum } from "~/components/editing/attributeEnum"
import { EditFormInput } from "~/components/editing/EditFormInput"

interface EntryEditingFormProps {
  data: LoadedDataType
}

export default function EntryEditingForm({ data }: EntryEditingFormProps) {
  const id = data.id
  const [headword, setHeadword] = useState(data.headword)
  const [spellingVariant, setSpellingVariant] = useState(
    data.spelling_variants || ""
  )
  const [generalLabels, setGeneralLabels] = useState(data.general_labels || "")
  const [handNote, setHandnote] = useState(data.fist_note || "")
  const [dagger, setDagger] = useState(data.dagger)
  const [etymology, setEtymology] = useState(data.etymology || "")
  const [isLegacy, setIsLegacy] = useState(data.is_legacy)
  const [isNonCanadian, setIsNonCanadian] = useState(data.no_cdn_conf)

  return (
    <Form method="post">
      <div className="grid grid-cols-6">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="attributeType" value={attributeEnum.ENTRY} />
        <EditFormInput
          label="headword: "
          name="headword"
          value={headword}
          onChangeFunction={setHeadword}
          className="col-span-2"
        />
        <EditFormInput
          label="Spelling Variants: "
          name="spellingVariant"
          value={spellingVariant}
          onChangeFunction={setSpellingVariant}
          className="col-span-2"
        />
        <EditFormInput
          label="General Labels: "
          name="generalLabels"
          value={generalLabels}
          onChangeFunction={setGeneralLabels}
          className="col-span-2"
        />
        <EditFormInput
          label="Etymology: "
          name="etymology"
          value={etymology}
          onChangeFunction={setEtymology}
          className="col-span-2"
        />
        <label className="col-span-1 m-2">
          Dagger
          <input
            name="dagger"
            checked={dagger}
            onChange={(e) => setDagger(e.target.checked)}
            type="checkBox"
            className="mx-3 border p-1"
          />
        </label>
        <label className="col-span-1 m-2">
          Legacy:
          <input
            name="isLegacy"
            checked={isLegacy}
            onChange={(e) => setIsLegacy(e.target.checked)}
            type="checkBox"
            className="mx-3 border p-1"
          />
        </label>
        <label className="col-span-1 m-2">
          Non Canadian:
          <input
            name="isNonCanadian"
            checked={isNonCanadian}
            onChange={(e) => setIsNonCanadian(e.target.checked)}
            type="checkBox"
            className="mx-3 border p-1"
          />
        </label>
        <EditFormInput
          label="Fist Note: "
          name="fistNote"
          value={handNote}
          type="textarea"
          onChangeFunction={setHandnote}
          className="col-span-6 my-4"
        />
        <Button className="col-span-2 col-start-3" type="submit" size="medium">
          Submit
        </Button>
      </div>
    </Form>
  )
}
