import type { BankCitationById, BankSource } from "~/models/bank.types"

export interface EditCitationProps {
  citation?: BankCitationById
  source?: BankSource
  place?: string
  title?: string
  author?: string
}
