import { useState } from "react"
import { formatCompact, formatCount } from "~/models/frequencyIndex"
import {
  type SeriesPoint,
  type TimeRange,
  changeSinceFirst,
  describePoint,
  formatChange,
  pointOrigin,
  scaleSeries,
  seriesStats,
  shortDate,
} from "~/models/normalizerSeries"

// One domain's normalizer counts over time, drawn the same way at two
// sizes. "spark" is the inch-wide line under the form and beside each
// count in the tables; "panel" is the card on the history page, with an
// axis and a heading. Both take a shared time range so the domains' lines
// line up date for date. Beneath either: the first and last points, and
// min, mean and max over the range shown. Hovering a point shows a card
// with the exact count.

const SIZES = {
  spark: { width: 120, height: 32, pad: 3, dot: 2.5, hit: 7, stroke: 1.5 },
  panel: { width: 320, height: 120, pad: 12, dot: 4, hit: 10, stroke: 2 },
} as const

const LINE = "#2563eb" // tailwind blue-600

type Props = {
  variant: keyof typeof SIZES
  label: string
  normalizer: string
  series: SeriesPoint[]
  range: TimeRange
  /** For the spark, the domain name and latest count above the line; off inside a table row. */
  showLabel?: boolean
}

export default function NormalizerSeriesChart({
  variant,
  label,
  normalizer,
  series,
  range,
  showLabel = true,
}: Props) {
  const size = SIZES[variant]
  const [hovered, setHovered] = useState<SeriesPoint | null>(null)
  const { x, y } = scaleSeries(series, range, size)
  const stats = seriesStats(series)
  const change = changeSinceFirst(series)
  const first = series[0]
  const last = series[series.length - 1]
  const panel = variant === "panel"

  const summary = stats
    ? `${label}: ${series.length} count${
        series.length === 1 ? "" : "s"
      } of "${normalizer}", latest ${formatCount(last.hits)}` +
      (change !== null
        ? `, ${formatChange(change)} since ${first.observed}`
        : "") +
      `. Min ${formatCount(stats.min)}, mean ${formatCount(
        Math.round(stats.mean)
      )}, max ${formatCount(stats.max)}.`
    : `${label}: no counts of "${normalizer}" in this range`

  const heading = panel ? (
    <figcaption className="mb-1 flex items-baseline justify-between gap-2">
      <span className="font-semibold">{label}</span>
      <span className="text-sm tabular-nums text-gray-600">
        {last ? formatCompact(last.hits) : "no counts"}
        {change !== null && (
          <span className="ml-2 text-gray-500">
            {formatChange(change)} since {shortDate(first.observed)}
          </span>
        )}
      </span>
    </figcaption>
  ) : (
    showLabel && (
      <span className="flex items-baseline justify-between gap-2 text-xs">
        <span className="whitespace-nowrap font-semibold">{label}</span>
        <span className="tabular-nums">
          {last ? formatCompact(last.hits) : "–"}
        </span>
      </span>
    )
  )

  const drawing =
    panel && series.length === 0 ? (
      <p className="py-8 text-center text-sm text-gray-500">
        No counts of &ldquo;{normalizer}&rdquo; in this range.
      </p>
    ) : (
      <span className="relative block">
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          className="h-auto w-full"
          role="img"
          aria-label={summary}
          preserveAspectRatio={panel ? "xMidYMid meet" : "none"}
        >
          {panel && (
            <line
              x1={size.pad}
              x2={size.width - size.pad}
              y1={size.height - size.pad}
              y2={size.height - size.pad}
              stroke="#d1d5db"
              strokeWidth={1}
            />
          )}
          {series.length > 1 && (
            <polyline
              fill="none"
              stroke={LINE}
              strokeWidth={size.stroke}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={series
                .map((p) => `${x(p.observed)},${y(p.hits)}`)
                .join(" ")}
            />
          )}
          {series.map((p) => (
            <g key={p.id}>
              <circle
                cx={x(p.observed)}
                cy={y(p.hits)}
                r={hovered === p ? size.dot * 1.4 : size.dot}
                fill={LINE}
                stroke={panel ? "#ffffff" : "none"}
                strokeWidth={panel ? 2 : 0}
              />
              {/* A wider, invisible target so the point is easy to hit. */}
              <circle
                cx={x(p.observed)}
                cy={y(p.hits)}
                r={size.hit}
                fill="transparent"
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          ))}
        </svg>
        {hovered && (
          <PointPopover
            point={hovered}
            xPct={(x(hovered.observed) / size.width) * 100}
            yPct={panel ? (y(hovered.hits) / size.height) * 100 : undefined}
          />
        )}
      </span>
    )

  const axis = panel && (
    <span className="flex justify-between text-xs text-gray-500">
      <span>{shortDate(new Date(range.min).toISOString())}</span>
      <span>{shortDate(new Date(range.max).toISOString())}</span>
    </span>
  )

  const small = panel ? "text-xs" : "text-[11px] leading-tight"
  const endpoints = first && (
    <span
      className={`flex justify-between gap-2 whitespace-nowrap tabular-nums text-gray-600 ${small}`}
    >
      <span>
        {panel && "First "}
        {formatCompact(first.hits)}{" "}
        <span className="text-gray-400">{shortDate(first.observed)}</span>
      </span>
      {last !== first && (
        <span>
          <span className="text-gray-400">{shortDate(last.observed)}</span>{" "}
          {panel && "Last "}
          {formatCompact(last.hits)}
        </span>
      )}
    </span>
  )

  const statsLine = stats && (
    <span className={`whitespace-nowrap tabular-nums text-gray-500 ${small}`}>
      {panel ? "Min " : ""}
      {formatCompact(stats.min)}
      <span className="text-gray-400"> · </span>
      {panel ? "mean " : ""}
      <strong className="text-gray-700">{formatCompact(stats.mean)}</strong>
      <span className="text-gray-400"> · </span>
      {panel ? "max " : ""}
      {formatCompact(stats.max)}
    </span>
  )

  if (panel)
    return (
      <figure className="rounded border border-gray-200 p-3">
        {heading}
        {drawing}
        {axis}
        <div className="mt-1 flex flex-col gap-0.5">
          {endpoints}
          {statsLine}
        </div>
      </figure>
    )

  return (
    <span className="flex flex-col">
      {heading}
      {drawing}
      {endpoints}
      {statsLine}
    </span>
  )
}

/**
 * A small card by the hovered point with the exact count, the date and
 * where it came from. Anchored at the point's share of the drawing's width
 * so it tracks a stretched svg; it hangs left, centred or right so it stays
 * inside the chart's column.
 */
function PointPopover({
  point,
  xPct,
  yPct,
}: {
  point: SeriesPoint
  /** The point's share of the drawing's width, 0 to 100. */
  xPct: number
  /** Its share of the height; omitted, the card sits above the drawing. */
  yPct?: number
}) {
  const shift = xPct < 30 ? "0" : xPct > 70 ? "-100%" : "-50%"
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute z-20 w-max max-w-[16rem] whitespace-normal rounded border border-gray-300 bg-white px-2 py-1 text-left text-xs leading-snug text-gray-800 shadow-md"
      style={{
        left: `${xPct}%`,
        ...(yPct === undefined
          ? { bottom: "100%", marginBottom: 4 }
          : { top: `${yPct}%`, marginTop: -10 }),
        transform: `translate(${shift}, ${yPct === undefined ? "0" : "-100%"})`,
      }}
    >
      <span className="block font-semibold tabular-nums">
        {formatCount(point.hits)}
      </span>
      <span className="block text-gray-600">
        {point.observed}, {pointOrigin(point)}
      </span>
      <span className="sr-only">{describePoint(point)}</span>
    </span>
  )
}
