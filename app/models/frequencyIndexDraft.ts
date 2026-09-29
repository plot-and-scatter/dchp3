// The unsaved state of the Frequency Index form, kept in localStorage so an
// accidental Cmd+W on the form tab (easy to do in a workflow built around
// Cmd+W) does not throw away fourteen typed counts. Cleared when a lookup
// is saved. Browser storage can be unavailable or throw, so every access is
// guarded and the form works without it.

export const FREQUENCY_DRAFT_KEY = "dchp3.frequencyIndex.draft"

export type FrequencyDraft = {
  savedAt: string
  term: string
  normalizer: string
  exclusions: string
  multiplier: number
  snapshot: { term: string; normalizer: string; exclusions: string } | null
  rows: Record<
    string,
    {
      termHits: string
      normalizerHits: string
      normalizerCountId: number | null
      reusedFrom: {
        observed: string
        source: string
        term: string | null
      } | null
    }
  >
}

export const readDraft = (): FrequencyDraft | null => {
  try {
    const raw = window.localStorage.getItem(FREQUENCY_DRAFT_KEY)
    if (!raw) return null
    const draft = JSON.parse(raw) as FrequencyDraft
    return draft && typeof draft.term === "string" && draft.rows ? draft : null
  } catch {
    return null
  }
}

export const writeDraft = (draft: Omit<FrequencyDraft, "savedAt">) => {
  try {
    window.localStorage.setItem(
      FREQUENCY_DRAFT_KEY,
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() })
    )
  } catch {
    // Storage full, blocked or private mode: the form still works.
  }
}

export const clearDraft = () => {
  try {
    window.localStorage.removeItem(FREQUENCY_DRAFT_KEY)
  } catch {
    // Nothing to do.
  }
}

/** A draft is worth restoring only if the student had built a table. */
export const draftHasWork = (draft: FrequencyDraft) =>
  draft.snapshot !== null &&
  Object.values(draft.rows).some(
    (r) => r.termHits !== "" || r.normalizerHits !== ""
  )
