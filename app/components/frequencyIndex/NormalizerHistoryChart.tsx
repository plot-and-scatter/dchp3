import type { NormalizerHistory } from "~/models/frequencyIndex.server"
import { historySeries } from "~/models/frequencyIndex"
import { timeRangeOf } from "~/models/normalizerSeries"
import NormalizerSeriesChart from "./NormalizerSeriesChart"

// One panel per search on the history page (the US has four), because the
// counts differ by orders of magnitude between .ca and .ie and a shared axis
// would flatten all but the largest. Counts from the old combined US search
// get a panel of their own, last, when the range has any.

type Props = { history: NormalizerHistory; normalizer: string }

export default function NormalizerHistoryChart({ history, normalizer }: Props) {
  const range = timeRangeOf(history)
  if (!range) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {historySeries(history).map((d) => (
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
