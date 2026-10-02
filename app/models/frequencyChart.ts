// The DCHP-2 frequency chart: one column per domain, index on the y-axis,
// in the format students have been producing by hand in Excel and uploading
// to entries (formatting guide from Natalia Mohar, 2026-09-30). Pure
// geometry and text, so the layout is testable and the SVG component only
// draws. Units are points: the image is 9 x 14 cm, and the guide gives
// font sizes in points, so a 1:1 viewBox keeps "12-point" meaning 12.
//
// No server imports: the chart is drawn in the browser, where the PNG is
// also rendered.

import { FREQUENCY_DOMAIN_KEYS, formatCount } from "./frequencyIndex"

export const CM_TO_PT = 72 / 2.54
export const CHART_WIDTH_PT = 14 * CM_TO_PT
export const CHART_HEIGHT_PT = 9 * CM_TO_PT

/** Resolution of the downloaded PNG. 300 dpi makes 14 cm = 1654 px. */
export const EXPORT_DPI = 300

/** The guide asks for Calibri; Carlito is its metric-compatible stand-in. */
export const CHART_FONT = "Calibri, Carlito, 'Segoe UI', Arial, sans-serif"
export const FONT_SIZE = { title: 18, axis: 12, yLabel: 12, dataLabel: 12 }
export const COLUMN_FILL = "#4472c4" // Excel's default first series
export const GRID_STROKE = "#d9d9d9" // Excel's default gridline
export const AXIS_STROKE = "#595959"

export type ChartBar = { key: string; label: string; value: number }

export type ChartLayout = {
  width: number
  height: number
  title: { text: string; x: number; y: number; size: number }
  yLabel: { text: string; x: number; y: number }
  plot: { x: number; y: number; w: number; h: number }
  ticks: { value: number; y: number; label: string }[]
  bars: {
    key: string
    x: number
    y: number
    w: number
    h: number
    /** The domain name, split onto two lines when it would not fit its slot. */
    labelLines: string[]
    labelX: number
    labelY: number
    valueLabel: string
    valueX: number
    valueY: number
  }[]
  dataLabelSize: number
  xLabelSize: number
}

export const yAxisLabel = (multiplier: number) =>
  `Frequency index (x${formatCount(multiplier)})`

/** "30 September 2026": the guide wants the month spelled out. */
export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

/** The caption typed into the entry's image upload, not drawn on the image. */
export const chartCaption = (created: string) =>
  `Internet Domain Search, ${longDate(created)}`

/** One decimal place on every column, as the guide asks ("e.g. 80.9"). */
export const dataLabel = (value: number) => value.toFixed(1)

export const chartFileName = (term: string, created: string) => {
  const slug =
    term
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "term"
  return `frequency-index-${slug}-${created.slice(0, 10)}.png`
}

/** Rows in the DCHP-2 domain order, whatever order they were stored in. */
export const sortBars = (bars: ChartBar[]) =>
  [...bars].sort(
    (a, b) =>
      FREQUENCY_DOMAIN_KEYS.indexOf(a.key) -
      FREQUENCY_DOMAIN_KEYS.indexOf(b.key)
  )

/** Decimal places needed to write the step exactly: 2.5 → 1, 0.25 → 2, 20 → 0. */
const decimalsOf = (step: number) =>
  (Number(step.toPrecision(12)).toString().split(".")[1] ?? "").length

export const formatTick = (value: number, step: number) =>
  value.toFixed(decimalsOf(step))

/**
 * A y-axis from zero to a round number above the tallest column, with about
 * five gridlines at a 1, 2, 2.5 or 5 step, the way Excel chooses them. The
 * 8% headroom keeps the tallest column's data label inside the plot.
 */
export const niceAxis = (max: number) => {
  const top = max > 0 ? max * 1.08 : 1
  const raw = top / 5
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)))
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ??
    10 * magnitude
  const decimals = decimalsOf(step)
  const axisMax = Number(
    (Math.ceil(top / step - 1e-9) * step).toFixed(decimals)
  )
  const ticks: number[] = []
  for (let i = 0; i * step <= axisMax + step / 2; i++)
    ticks.push(Number((i * step).toFixed(decimals)))
  return { max: axisMax, step, ticks }
}

/** Rough text width for layout: Calibri averages about 0.5 em per character. */
const textWidth = (text: string, size: number) => text.length * 0.5 * size

/** Shrink a font until the text fits, but not below `min`. */
const fitFont = (text: string, size: number, room: number, min: number) =>
  Math.max(min, Math.min(size, Math.floor(room / (0.5 * text.length))))

export const layoutChart = (
  bars: ChartBar[],
  options: { title: string; multiplier: number }
): ChartLayout => {
  const width = CHART_WIDTH_PT
  const height = CHART_HEIGHT_PT
  const ordered = sortBars(bars)
  const axis = niceAxis(Math.max(0, ...ordered.map((b) => b.value)))
  const tickLabels = axis.ticks.map((t) => formatTick(t, axis.step))
  const tickWidth = Math.max(
    ...tickLabels.map((l) => textWidth(l, FONT_SIZE.axis))
  )

  const titleSize = fitFont(options.title, FONT_SIZE.title, width - 16, 12)
  const top = titleSize * 1.5 + 6
  const left = FONT_SIZE.yLabel * 1.3 + tickWidth + 10
  const right = 10
  const plotW = width - left - right
  const slot = plotW / Math.max(1, ordered.length)
  const barW = slot * 0.62

  // "New Zealand" and "South Africa" do not fit a seventh of the width at
  // 12 pt, so a name wider than its slot goes onto two lines, and only then
  // is the font shrunk.
  const labelLines = ordered.map((b) =>
    textWidth(b.label, FONT_SIZE.axis) > slot * 0.95 && b.label.includes(" ")
      ? splitInTwo(b.label)
      : [b.label]
  )
  // A one-word name may spill a little into its neighbours' slots, since
  // the wrapped names beside it are short; shrink only past that.
  const xLabelSize = Math.min(
    FONT_SIZE.axis,
    ...labelLines.flat().map((l) => fitFont(l, FONT_SIZE.axis, slot * 1.25, 8))
  )
  const maxLines = Math.max(...labelLines.map((l) => l.length))
  const bottom = xLabelSize * 1.2 * maxLines + 8
  const plot = { x: left, y: top, w: plotW, h: height - top - bottom }

  const yOf = (v: number) => plot.y + plot.h - (v / axis.max) * plot.h
  const dataLabelSize = Math.min(
    ...ordered.map((b) =>
      fitFont(dataLabel(b.value), FONT_SIZE.dataLabel, slot * 0.95, 8)
    ),
    FONT_SIZE.dataLabel
  )

  return {
    width,
    height,
    title: {
      text: options.title,
      x: width / 2,
      y: titleSize * 1.15,
      size: titleSize,
    },
    yLabel: {
      text: yAxisLabel(options.multiplier),
      x: FONT_SIZE.yLabel,
      y: plot.y + plot.h / 2,
    },
    plot,
    ticks: axis.ticks.map((value, i) => ({
      value,
      y: yOf(value),
      label: tickLabels[i],
    })),
    bars: ordered.map((b, i) => {
      const x = plot.x + slot * i + (slot - barW) / 2
      const y = yOf(b.value)
      return {
        key: b.key,
        x,
        y,
        w: barW,
        h: plot.y + plot.h - y,
        labelLines: labelLines[i],
        labelX: x + barW / 2,
        labelY: plot.y + plot.h + xLabelSize * 1.1,
        valueLabel: dataLabel(b.value),
        valueX: x + barW / 2,
        valueY: y - 3,
      }
    }),
    dataLabelSize,
    xLabelSize,
  }
}

/** Split at the space nearest the middle: "New Zealand" → ["New", "Zealand"]. */
const splitInTwo = (label: string) => {
  const words = label.split(" ")
  const diff = (n: number) =>
    Math.abs(
      words.slice(0, n).join(" ").length - words.slice(n).join(" ").length
    )
  let best = 1
  for (let i = 2; i < words.length; i++) if (diff(i) < diff(best)) best = i
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")]
}
