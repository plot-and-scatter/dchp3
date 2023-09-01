import DictionaryVersion from "../DictionaryVersion"
import HandNoteBlock from "../HandNoteBlock"
import { attributeEnum } from "../editing/attributeEnum"
import { editablePopoverInputTypes } from "../editing/EditablePopoverInput"
import EditingPopover from "../editing/EditingPopover"
import GeneralLabels from "./GeneralLabels"
import Etymology from "./Etymology"
import Alternatives from "./Alternatives"
import { Form, Link } from "@remix-run/react"
import Button from "../elements/Button"

interface HeadwordProps {
  alternatives?: string
  etymology?: string
  generalLabels?: string
  handNote?: string
  hasDagger?: boolean
  isLegacy: boolean
  isNonCanadian?: boolean
  word: string
  id: number
}

const Headword = ({
  alternatives,
  etymology,
  generalLabels,
  handNote,
  hasDagger,
  isLegacy,
  isNonCanadian,
  word,
  id,
}: HeadwordProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2 leading-tight md:gap-4" id="headword">
      <div className="flex items-center justify-between">
        <div className="flex justify-center align-middle">
          <h1 className="text-3xl leading-tight md:text-5xl">
            {word}
            {hasDagger && <span className="align-super">&dagger;</span>}
          </h1>
          <EditingPopover
            currentValue={word}
            attributeType={attributeEnum.HEADWORD}
            attributeID={id}
          />
        </div>
        <Link
          className="rounded border border-slate-700 bg-slate-600 p-2 text-white transition-colors duration-300 hover:bg-slate-500"
          to={`/entries/${word}/edit`}
        >
          Edit
        </Link>
        <DictionaryVersion isLegacy={isLegacy} />
      </div>
      <div className="flex flex-row">
        <Alternatives alternatives={alternatives} />
        <EditingPopover
          currentValue={alternatives}
          attributeType={attributeEnum.SPELLING_VARIANT}
          attributeID={id}
          type={editablePopoverInputTypes.TEXTAREA}
        />
      </div>
      <div className="flex flex-row">
        <Etymology etymology={etymology} />
        <EditingPopover
          currentValue={etymology}
          attributeType={attributeEnum.ETYMOLOGY}
          attributeID={id}
          type={editablePopoverInputTypes.TEXTAREA}
        />
        <GeneralLabels generalLabels={generalLabels} />
        <EditingPopover
          currentValue={generalLabels}
          attributeType={attributeEnum.LABELS}
          attributeID={id}
        />
      </div>
      <div className="flex flex-row">
        {handNote && (
          <HandNoteBlock className="text-xs text-slate-500 md:text-lg">
            {handNote}
          </HandNoteBlock>
        )}
        <EditingPopover
          currentValue={handNote}
          buttonLabel={"Add Headword Fist note"}
          attributeType={attributeEnum.FIST_NOTE}
          attributeID={id}
          type={editablePopoverInputTypes.TEXTAREA}
        />
      </div>
      {isNonCanadian && (
        <div className="border border-red-300 bg-red-200 p-3 font-bold">
          Non-Canadianism
        </div>
      )}
      <Form reloadDocument={true} action={`/entries/${word}`} method="post">
        <Button>Add Meaning</Button>
        <input
          type="hidden"
          name="attributeType"
          value={attributeEnum.ADD_MEANING}
        />
        <input type="hidden" name="attributeID" value={id} />
      </Form>
    </div>
  )
}

export default Headword
