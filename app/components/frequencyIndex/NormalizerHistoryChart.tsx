import type { NormalizerHistory } from "~/models/frequencyIndex.server"
import { FREQUENCY_DOMAINS } from "~/models/frequencyIndex"
import { timeRangeOf } from "~/models/normalizerSeries"
import NormalizerSeriesChart from "./NormalizerSeriesChart"

// One panel per domain on the history page, because the counts differ by
// orders of magnitude between .ca and .ie and a shared axis would flatten
// all but the largest.

type Props = { history: NormalizerHistory; normalizer: string }

export default function NormalizerHistoryChart({ history, normalizer }: Props) {
  const range = timeRangeOf(history)
  if (!range) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {FREQUENCY_DOMAINS.map((d) => (
        <NormalizerSeriesChart
          key={d.key}
          variant="panel"
          label={d.label}
          normalizer={normalizer}
          series={history[d.key] ?? []}
          range={range}
        />
      ))}
    </div>
  )
}
