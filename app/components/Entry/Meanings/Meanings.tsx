import type { MeaningType } from "./Meaning"
import Meaning from "./Meaning"

interface MeaningsProps {
  meanings: MeaningType[]
}

const Meanings = ({ meanings }: MeaningsProps): JSX.Element => {
  return (
    <div id="definitions">
      {meanings
        .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
        .map((meaning) => (
          <Meaning key={meaning.id} meaning={meaning} />
        ))}
    </div>
  )
}

export default Meanings
