export enum POSEnum {
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

export enum LegacyTypeEnum {
  "Avis" = 1,
  "MacDonald" = 2,
  "DCHP-1" = 3,
  "Paper Files" = 4,
  "DCHP-2" = 5,
  "Teach" = 6,
  "DCHP-3" = 7,
}

export enum SourceTypeEnum {
  "Book" = 0,
  "Periodical" = 1,
  "Site/Flier" = 2,
  "Spoken Language" = 3,
}

export type GetOwnCitationType = {
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

export type GetCitationByIdType = {
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
  legacy_id: LegacyTypeEnum
  is_incomplete: string
  headword: string
  source_id: number
  year_published: string
  year_composed: string
  type_id: SourceTypeEnum
  page: string
  email: string
}

export type CitationsByHeadwordAndUserIdType = {
  id: number
  headword_id: number
  headword: string
  name: string
  year_published: string
  email: string
}

export type TitleNameType = {
  name: string
}

export type PlaceNameType = {
  name: string
}

export type AuthorNameType = {
  name: string
}

export type UtteranceType = {
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
