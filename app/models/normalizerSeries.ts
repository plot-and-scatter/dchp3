// Pure calculations behind the normalizer charts: the sparklines under the
// form and in the tables, and the panels on the history page, all draw the
// same series the same way. Nothing here touches React or the database.

import { formatCount } from "./frequencyIndex"

/** The fields of a normalizer observation the charts need. */
export type SeriesPoint = {
  id: number
  hits: number
  /** Calendar date, YYYY-MM-DD, stored at UTC midnight. */
  observed: string
  source: string
  lookup: { id: number; term: string } | null
}

/** Shared time axis so the domains' lines line up date for date. */
export type TimeRange = { min: number; max: number }

export const timeRangeOf = (
  seriesByDomain: Record<string, SeriesPoint[]> | undefined
): TimeRange | null => {
  const times = seriesByDomain
    ? Object.values(seriesByDomain)
        .flat()
        .map((p) => new Date(p.observed).getTime())
    : []
  if (times.length === 0) return null
  return { min: Math.min(...times), max: Math.max(...times) }
}

export type SeriesStats = { min: number; mean: number; max: number }

export const seriesStats = (series: SeriesPoint[]): SeriesStats | null => {
  if (series.length === 0) return null
  const hits = series.map((p) => p.hits)
  return {
    min: Math.min(...hits),
    mean: hits.reduce((a, b) => a + b, 0) / hits.length,
    max: Math.max(...hits),
  }
}

/** Percentage change from the first point to the last; null with fewer than two. */
export const changeSinceFirst = (series: SeriesPoint[]): number | null => {
  const first = series[0]
  const last = series[series.length - 1]
  if (!first || !last || first === last || first.hits <= 0) return null
  return ((last.hits - first.hits) / first.hits) * 100
}

export const formatChange = (change: number) =>
  `${change > 0 ? "+" : ""}${change.toFixed(1)}%`

/**
 * Maps a series into a drawing of `width` by `height` with the given
 * padding. The y-axis is padded a quarter of the spread above and below the
 * observed range rather than starting at zero, because the drift is what
 * matters, not the size; a flat series gets a band so it draws mid-height.
 */
export const scaleSeries = (
  series: SeriesPoint[],
  range: TimeRange,
  box: { width: number; height: number; pad: number }
) => {
  const stats = seriesStats(series)
  const lo = stats?.min ?? 0
  const hi = stats?.max ?? 1
  const spread = hi - lo || Math.max(hi * 0.1, 1)
  const yMin = Math.max(0, lo - spread * 0.25)
  const yMax = hi + spread * 0.25
  const tSpan = range.max - range.min || 1
  const innerW = box.width - 2 * box.pad
  const innerH = box.height - 2 * box.pad
  return {
    x: (observed: string) =>
      box.pad + ((new Date(observed).getTime() - range.min) / tSpan) * innerW,
    y: (hits: number) => box.pad + innerH * (1 - (hits - yMin) / (yMax - yMin)),
  }
}

/** "Jul 19", formatted in UTC so a Pacific browser does not show the day before. */
export const shortDate = (observed: string) =>
  new Date(observed).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })

/** Where a point came from, for the hover card and screen readers. */
export const pointOrigin = (p: SeriesPoint) =>
  p.lookup ? `for “${p.lookup.term}”` : `from ${p.source}`

export const describePoint = (p: SeriesPoint) =>
  `${formatCount(p.hits)} on ${p.observed}, ${pointOrigin(p)}`

export const historyHref = (normalizer: string) =>
  `/frequency-index/normalizers?${new URLSearchParams({ normalizer })}`
