import DictionaryVersion from "./DictionaryVersion"
import HandNoteBlock from "./HandNoteBlock"
import SanitizedTextSpan from "./SanitizedTextSpan"
import { attributeEnum } from "./editing/attributeEnum"
import EditingPopover from "./editing/editingPopover"

interface HeadwordProps {
  alternatives?: string
  etymology?: string
  generalLabels?: string
  handNote?: string
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
  isLegacy,
  isNonCanadian,
  word,
  id,
}: HeadwordProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2 leading-tight md:gap-4" id="headword">
      <div className="flex items-center justify-between">
        <div className="flex justify-center align-middle">
          <h1 className="text-3xl leading-tight md:text-5xl">{word}</h1>
          <EditingPopover
            attributeType={attributeEnum.HEADWORD}
            attributeID={id}
          />
        </div>
        <DictionaryVersion isLegacy={isLegacy} />
      </div>
      {alternatives && (
        <h2 className="leading-tight text-slate-700 md:text-xl">
          <span className="text-slate-500">Spelling variants:</span>{" "}
          <span className="italic">
            <SanitizedTextSpan text={alternatives} />
          </span>
        </h2>
      )}
      <p>
        {etymology && (
          <span className="mr-1">
            <SanitizedTextSpan text={etymology} />
          </span>
        )}
        {generalLabels && (
          <span className="mr-1 italic">
            <SanitizedTextSpan text={generalLabels} />
          </span>
        )}
      </p>
      {handNote && (
        <HandNoteBlock className="text-xs text-slate-500 md:text-lg">
          {handNote}
        </HandNoteBlock>
      )}
      {isNonCanadian && (
        <div className="border border-red-300 bg-red-200 p-3 font-bold">
          Non-Canadianism
        </div>
      )}
    </div>
  )
}

export default Headword
