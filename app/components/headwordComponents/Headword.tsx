import DictionaryVersion from "../DictionaryVersion"
import HandNoteBlock from "../HandNoteBlock"
import GeneralLabels from "./GeneralLabels"
import Etymology from "./Etymology"
import Alternatives from "./Alternatives"
import { Link } from "../elements/LinksAndButtons/Link"
import type { LogEntry } from "@prisma/client"
import type { SerializeFrom } from "@remix-run/server-runtime"

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
  logEntries?: SerializeFrom<LogEntry>[]
  showEditButton?: boolean
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
  logEntries,
  showEditButton,
}: HeadwordProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2 leading-tight md:gap-4" id="headword">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex justify-center align-middle">
            <h1 className="text-3xl leading-tight md:text-5xl">
              {word}
              {hasDagger && <span className="align-super">&dagger;</span>}
            </h1>
          </div>
          {showEditButton && (
            <Link asButton className="ml-4" to={`/entries/${word}/edit`}>
              Edit
            </Link>
          )}
        </div>
        <DictionaryVersion isLegacy={isLegacy} logEntries={logEntries} />
      </div>
      <Alternatives alternatives={alternatives} />
      <div className="flex flex-row">
        <Etymology etymology={etymology} />
        <GeneralLabels generalLabels={generalLabels} />
      </div>
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
