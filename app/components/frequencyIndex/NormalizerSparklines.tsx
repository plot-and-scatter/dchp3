import { Link } from "~/components/elements/LinksAndButtons/Link"
import type { NormalizerHistory } from "~/models/frequencyIndex.server"
import { FREQUENCY_SEARCHES } from "~/models/frequencyIndex"
import { historyHref, timeRangeOf } from "~/models/normalizerSeries"
import NormalizerSeriesChart from "./NormalizerSeriesChart"

// The sparklines under the form, one per search (the US has four), for
// whichever normalizer is typed, until the table is built and each moves
// into its search's row.

type Props = {
  normalizer: string
  history: NormalizerHistory | undefined
  days: number
}

export default function NormalizerSparklines({
  normalizer,
  history,
  days,
}: Props) {
  const n = normalizer.trim()
  if (!n) return null
  const range = timeRangeOf(history)

  if (!range)
    return (
      <p className="mt-2 text-sm text-gray-600">
        No counts of &ldquo;{n}&rdquo; saved in the last {days} days.{" "}
        <Link to={historyHref(n)}>All-time history</Link>
      </p>
    )

  return (
    <div className="mt-3 text-sm text-gray-600">
      <div className="grid grid-cols-3 gap-x-5 gap-y-2 md:grid-cols-5">
        {FREQUENCY_SEARCHES.map((d) => (
          <NormalizerSeriesChart
            key={d.key}
            variant="spark"
            label={d.label}
            normalizer={n}
            series={history?.[d.key] ?? []}
            range={range}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Normalizer &ldquo;{n}&rdquo; over the last {days} days, per domain.{" "}
        <Link to={historyHref(n)}>Full history</Link>
      </p>
    </div>
  )
}
