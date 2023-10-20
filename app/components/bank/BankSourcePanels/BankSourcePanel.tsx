import { useState } from "react"
import { BankSourceTypeEnum } from "~/models/bank.types"
import BookPanel from "./BookPanel"
import PeriodicalPanel from "./PeriodicalPanel"
import SiteFlierPanel from "./SiteFlierPanel"
import SpokenLanguagePanel from "./SpokenLanguagePanel"
import ActiveSourcePicker from "./ActiveSourcePicker"
import BankInput from "../BankInput"
import type { BankEditCitationFieldsProps } from "../BankEditCitationFields"

export default function BankSourcePanel(props: BankEditCitationFieldsProps) {
  const [activeSourceType, setActiveSourceType] = useState<BankSourceTypeEnum>(
    props.citation?.source?.type_id || 0
  )

  return (
    <>
      <ActiveSourcePicker
        activeSourceType={activeSourceType}
        setActiveSourceType={setActiveSourceType}
      />
      <BankInput name={`source.type_id`} value={activeSourceType} readOnly />
      <BankInput
        name={`source.id`}
        value={props.citation?.source_id || undefined}
        hidden
      />
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
