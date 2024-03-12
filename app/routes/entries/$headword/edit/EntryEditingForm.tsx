import { Form, Link } from "@remix-run/react"
import { useState } from "react"
import { type LoadedEntryDataType } from ".."
import Button from "~/components/elements/LinksAndButtons/Button"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { EditFormInput } from "~/components/EntryEditor/EntryEditorForm/EditFormInput"
import Headword from "~/components/Entry/Headword/Headword"
import DictionaryVersion from "~/components/EntryEditor/DictionaryVersion"
import HandNoteBlock from "~/components/Entry/Common/HandNoteBlock"
import SanitizedTextSpan from "~/components/Entry/Common/SanitizedTextSpan"
import EditIcon from "~/components/elements/Icons/EditIcon"
import SpellingVariants from "~/components/Entry/Headword/SpellingVariants"
import Etymology from "~/components/Entry/Headword/Etymology"
import GeneralLabels from "~/components/Entry/Headword/GeneralLabels"
import Input from "~/components/bank/Input"
import TopLabelledField from "~/components/bank/TopLabelledField"

interface EntryEditingFormProps {
  entry: LoadedEntryDataType
}

export default function EntryEditingForm({ entry }: EntryEditingFormProps) {
  const id = entry.id
  const [headword, setHeadword] = useState(entry.headword)
  const [spellingVariant, setSpellingVariant] = useState(
    entry.spelling_variants || ""
  )
  const [generalLabels, setGeneralLabels] = useState(entry.general_labels || "")
  const [handNote, setHandnote] = useState(entry.fist_note || "")
  const [dagger, setDagger] = useState(entry.dagger)
  const [etymology, setEtymology] = useState(entry.etymology || "")
  const [isLegacy, setIsLegacy] = useState(entry.is_legacy)
  const [isNonCanadian, setIsNonCanadian] = useState(entry.no_cdn_conf)

  return (
    <Form method="post">
      <input type="hidden" name="id" value={id} />

      <div className="grid grid-cols-6">
        <input
          type="hidden"
          name="attributeType"
          value={EntryEditorFormActionEnum.UPDATE_ENTRY}
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
