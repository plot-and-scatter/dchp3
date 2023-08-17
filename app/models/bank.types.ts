import type {
  BankCitation,
  BankSource as PrismaBankSource,
} from "@prisma/client"

export enum BankPosEnum {
  "Other" = "..",
  "Adjective" = "adj.",
  "Adverb" = "adv.",
  "Noun" = "n.",
  "Verb" = "v.",
  "Preposition" = "prep.",
  "Expression" = "exp.",
  "Pragmatic Marker" = "prag.",
  "Interjection" = "int.",
}

export enum BankLegacyTypeEnum {
  "Avis" = 1,
  "MacDonald" = 2,
  "DCHP-1" = 3,
  "Paper Files" = 4,
  "DCHP-2" = 5,
  "Teach" = 6,
  "DCHP-3" = 7,
}

export enum BankSourceTypeEnum {
  "Book" = 0,
  "Periodical" = 1,
  "Site/Flier" = 2,
  "Spoken Language" = 3,
}

export type BankGetOwnCitation = {
  user_id: number
  last_modified_user_id: number
  text: string
  id: number
  short_meaning: string
  spelling_variant: string
  created: string
  last_modified: string
  headword: string
  source_id: number
  year_published: number
  type_id: number
  year_composed: string
  place_name: string
  email: string
}

export type BankCitationById = {
  memo: string
  user_id: number
  last_modified_user_id: number
  text: string
  clip_start: number
  clip_end: number
  clipped_text: string
  id: number
  short_meaning: string
  spelling_variant: string
  created: string
  last_modified: string
  part_of_speech: string
  legacy_id: BankLegacyTypeEnum
  is_incomplete: string
  headword: string
  source_id: number
  year_published: string
  year_composed: string
  type_id: BankSourceTypeEnum
  page: string
  email: string
}

export type BankCitationsByHeadwordAndUserId = {
  id: number
  headword_id: number
  headword: string
  name: string
  year_published: string
  email: string
}

export type BankTitleName = {
  name: string
}

export type BankPlaceName = {
  name: string
}

export type BankAuthorName = {
  name: string
}

export type BankSource = {
  uttered: string
  utterance_witness: string
  utterance_time: string
  utterance_media: string
  utterance_broadcast: string
  evidence: string
  periodical_date: string
  dateline: string
  volume_issue: string
  url: string
  url_access_date: string
  publisher: string
  editor: string
  year_composed: string
}

export type BankPrimaryKey = {
  id: number
}

export type BankCitationUpdate = Pick<
  BankCitation,
  | "id"
  | "memo"
  | "headword_id"
  | "short_meaning"
  | "spelling_variant"
  | "part_of_speech"
  | "text"
  | "clip_start"
  | "clip_end"
  | "clipped_text"
  | "last_modified"
  | "last_modified_user_id"
  | "legacy_id"
  | "is_incomplete"
>

export type BankSourceUpdate = PrismaBankSource
