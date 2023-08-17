import type { GetCitationByIdType, UtteranceType } from "~/models/bank.types"

export interface EditCitationProps {
  citation: GetCitationByIdType
  utterance: UtteranceType
  place: string
  title: string
  author: string
}
