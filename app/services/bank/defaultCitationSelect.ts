export const DEFAULT_CITATION_SELECT = {
  user_id: true,
  last_modified_user_id: true,
  text: true,
  id: true,
  short_meaning: true,
  last_modified: true,
  source_id: true,
  spelling_variant: true,
  headword: { select: { headword: true } },
  source: {
    select: {
      year_published: true,
      year_composed: true,
      type_id: true,
      place: { select: { name: true } },
    },
  },
}
