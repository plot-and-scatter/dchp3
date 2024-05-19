import type { MeaningType } from "./Meaning"
import Meaning from "./Meaning"

interface MeaningsProps {
  meanings: MeaningType[]
  canUserViewDraftEntry: boolean
}

const Meanings = ({
  meanings,
  canUserViewDraftEntry,
}: MeaningsProps): JSX.Element => {
  return (
    <div id="definitions">
      {meanings
        .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
        .map((meaning) => (
          <Meaning
            key={meaning.id}
            meaning={meaning}
            canUserViewDraftEntry={canUserViewDraftEntry}
          />
        ))}
    </div>
  )
}

export default Meanings
