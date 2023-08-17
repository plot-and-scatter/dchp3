import { useState } from "react"
import { BankSourceTypeEnum } from "~/models/bank.types"
import BookPanel from "./BookPanel"
import PeriodicalPanel from "./PeriodicalPanel"
import SiteFlierPanel from "./SiteFlierPanel"
import SpokenLanguagePanel from "./SpokenLanguagePanel"
import ActiveSourcePicker from "./ActiveSourcePicker"
import type { EditCitationProps } from "../EditCitationProps"
import BankInput from "../BankInput"

export default function BankSourcePanel(props: EditCitationProps) {
  const [activeSourceType, setActiveSourceType] = useState<BankSourceTypeEnum>(
    props.citation.type_id
  )

  return (
    <>
      <ActiveSourcePicker
        activeSourceType={activeSourceType}
        setActiveSourceType={setActiveSourceType}
      />
      <BankInput name={`source.type_id`} value={activeSourceType} hidden />
      <BankInput name={`source.id`} value={props.citation.source_id} hidden />
      {activeSourceType === BankSourceTypeEnum.Book && <BookPanel {...props} />}
      {activeSourceType === BankSourceTypeEnum.Periodical && (
        <PeriodicalPanel {...props} />
      )}
      {activeSourceType === BankSourceTypeEnum["Site/Flier"] && (
        <SiteFlierPanel {...props} />
      )}
      {activeSourceType === BankSourceTypeEnum["Spoken Language"] && (
        <SpokenLanguagePanel {...props} />
      )}
    </>
  )
}
