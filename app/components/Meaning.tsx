import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import Definition from "./Definition"
import HandNoteBlock from "~/components/HandNoteBlock"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import Canadianism from "./Canadianism"
import Citations from "./Citations"
import SeeAlsoItems from "~/components/SeeAlsoItems"
import MeaningHeader from "./meaningComponents/MeaningHeader"

export type MeaningType = LoadedEntryDataType["meanings"][0]

interface MeaningProps {
  meaning: MeaningType
}

const Meaning = ({ meaning }: MeaningProps): JSX.Element => {
  const {
    order: number,
    partofspeech: partOfSpeech,
    usage: usageNote,
    dagger,
  } = meaning

  return (
    <>
      <div
        className="-mx-3 my-3 border-l-8 border-gray-200 md:my-8 md:text-lg"
        id={`meaning-${meaning.id}`}
      >
        <MeaningHeader
          number={number}
          dagger={dagger}
          partOfSpeech={partOfSpeech}
          usageNote={usageNote}
        />
        <div className="flex flex-col gap-2 p-2 md:p-4 md:px-6">
          <Definition meaning={meaning} />
          <Canadianism meaning={meaning} />
          <SeeAlsoItems seeAlsoItems={meaning.seeAlso} />
          {meaning.usageNotes.length > 0 &&
            meaning.usageNotes.map((usageNote) => (
              <HandNoteBlock key={`usage-note-${usageNote.id}`}>
                <SanitizedTextSpan toDoubleBreaks text={usageNote.text} />
              </HandNoteBlock>
            ))}
          <Citations meaning={meaning} />
        </div>
      </div>
    </>
  )
}

export default Meaning
