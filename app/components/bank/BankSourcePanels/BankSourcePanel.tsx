import { useState } from "react"
import { sourceTypeToText } from "utils/source"
import type {
  GetCitationByIdType,
  UtteranceType,
} from "~/models/citation.types"
import { SourceTypeEnum } from "~/models/citation.types"
import BookPanel from "./BookPanel"
import PeriodicalPanel from "./PeriodicalPanel"
import SiteFlierPanel from "./SiteFlierPanel"
import SpokenLanguagePanel from "./SpokenLanguagePanel"

export interface BankSourcePanelProps {
  citation: GetCitationByIdType
  utterance: UtteranceType
  place: string
  title: string
  author: string
}

export default function BankSourcePanel(props: BankSourcePanelProps) {
  const [activeSourceType, setActiveSourceType] = useState<SourceTypeEnum>(
    props.citation.type_id
  )

  console.log(activeSourceType, SourceTypeEnum.Book)

  return (
    <>
      <div className="text-lg font-bold">
        {sourceTypeToText(props.citation.type_id)}
      </div>
      {activeSourceType === SourceTypeEnum.Book && <BookPanel {...props} />}
      {activeSourceType === SourceTypeEnum.Periodical && (
        <PeriodicalPanel {...props} />
      )}
      {activeSourceType === SourceTypeEnum["Site/Flier"] && (
        <SiteFlierPanel {...props} />
      )}
      {activeSourceType === SourceTypeEnum["Spoken Language"] && (
        <SpokenLanguagePanel {...props} />
      )}
    </>
  )
}
