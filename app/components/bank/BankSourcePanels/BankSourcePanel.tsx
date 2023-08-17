import { useState } from "react"
import { SourceTypeEnum } from "~/models/bank.types"
import BookPanel from "./BookPanel"
import PeriodicalPanel from "./PeriodicalPanel"
import SiteFlierPanel from "./SiteFlierPanel"
import SpokenLanguagePanel from "./SpokenLanguagePanel"
import ActiveSourcePicker from "./ActiveSourcePicker"
import type { EditCitationProps } from "../EditCitationProps"

export default function BankSourcePanel(props: EditCitationProps) {
  const [activeSourceType, setActiveSourceType] = useState<SourceTypeEnum>(
    props.citation.type_id
  )

  return (
    <>
      <ActiveSourcePicker
        activeSourceType={activeSourceType}
        setActiveSourceType={setActiveSourceType}
      />
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
