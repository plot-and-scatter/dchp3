import { Link } from "~/components/elements/LinksAndButtons/Link"
import type { NormalizerHistory } from "~/models/frequencyIndex.server"
import { FREQUENCY_DOMAINS } from "~/models/frequencyIndex"
import { historyHref, timeRangeOf } from "~/models/normalizerSeries"
import NormalizerSeriesChart from "./NormalizerSeriesChart"

// The seven sparklines in a row under the form, for whichever normalizer
// is typed, until the table is built and each moves into its domain's row.

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
      <div className="grid grid-cols-4 gap-x-5 gap-y-2 md:grid-cols-7">
        {FREQUENCY_DOMAINS.map((d) => (
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
