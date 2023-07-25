import React from "react"

import type { MeaningType } from "./Meaning"
import Meaning from "./Meaning"

interface MeaningsProps {
  word: string
  meanings: MeaningType[]
}

const Meanings = ({ word, meanings }: MeaningsProps): JSX.Element => {
  return (
    <div id="definitions">
      {meanings
        .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
        .map((meaning) => (
          <Meaning key={meaning.id} word={word} meaning={meaning} />
        ))}
    </div>
  )
}

export default Meanings
