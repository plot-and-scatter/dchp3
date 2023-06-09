import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import type { MeaningType } from "./Meaning"

interface DefinitionProps {
  meaning: MeaningType
}

const Definition = ({ meaning }: DefinitionProps): JSX.Element => {
  return (
    <p className="mb-4 text-sm font-bold text-slate-500 md:text-xl">
      <SanitizedTextSpan text={meaning.definition} />
    </p>
  )
}

export default Definition
