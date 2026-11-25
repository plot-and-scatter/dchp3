import { Fragment } from "react"
import type {
  FrequencyDomainView,
  FrequencyLookupRowView,
  NormalizerHistory,
} from "~/models/frequencyIndex.server"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import NormalizerSeriesChart from "./NormalizerSeriesChart"
import { historyHref, timeRangeOf } from "~/models/normalizerSeries"
import {
  formatCount,
  formatIndex,
  googleSearchUrl,
} from "~/models/frequencyIndex"
import { userName } from "./userName"

type Props = {
  /** The lookup's rows grouped by country. */
  domains: FrequencyDomainView[]
  multiplier: number
  /** Recent observations of the lookup's normalizer, for a sparkline per row. */
  history?: { normalizer: string; days: number; series: NormalizerHistory }
}

// Read-only view of a saved lookup. The counts link to the exact query they
// came from so a reviewer can re-run it and see what it was measuring. The
// normalizer column says where each count came from, because a count reused
// from another lookup or imported from a spreadsheet was not read here.
//
// A country counted with several searches (the US) has a line with the
// counts added up and its index, then one line per search beneath it.
export default function LookupRowsTable({
  domains,
  multiplier,
  history,
}: Props) {
  const range = history ? timeRangeOf(history.series) : null
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b-2 border-gray-400">
          <th className="py-2 pr-4">Domain</th>
          <th className="py-2 pr-4 text-right">Term hits</th>
          <th className="py-2 pr-4 text-right">
            Normalizer hits
            {history && range && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                line: last {history.days} days,{" "}
                <Link to={historyHref(history.normalizer)}>full history</Link>
              </span>
            )}
          </th>
          <th className="py-2 pr-4 text-right">
            Index (&times;{formatCount(multiplier)})
          </th>
        </tr>
      </thead>
      <tbody>
        {domains.map((d) => {
          const grouped = d.method === "added"
          return (
            <Fragment key={d.domainKey}>
              {grouped && (
                <tr className="align-top">
                  <td className="pb-1 pt-2 pr-4">
                    {d.domainLabel}{" "}
                    <span className="text-sm text-gray-500">
                      {d.rows.length} searches, added up
                    </span>
                  </td>
                  <td className="pb-1 pt-2 pr-4 text-right tabular-nums">
                    {formatCount(d.termHits)}
                  </td>
                  <td className="pb-1 pt-2 pr-4 text-right tabular-nums">
                    {formatCount(d.normalizerHits)}
                  </td>
                  <td className="pb-1 pt-2 pr-4 text-right font-semibold tabular-nums">
                    {formatIndex(d.frequencyIndex)}
                  </td>
                </tr>
              )}
              {d.rows.map((r, position) => (
                <tr
                  key={r.id}
                  className={
                    "align-top" +
                    (position === d.rows.length - 1
                      ? " border-b border-gray-200"
                      : "")
                  }
                >
                  <td className={"py-2 pr-4" + (grouped ? " pl-6" : "")}>
                    {grouped ? (
                      <span className="text-gray-700">{r.siteClause}</span>
                    ) : (
                      <Fragment>
                        {r.domainLabel}{" "}
                        <span className="text-sm text-gray-500">
                          {r.siteClause}
                        </span>
                      </Fragment>
                    )}
                    {d.method === "combined" && (
                      <div className="text-sm text-amber-700">
                        One combined search: this index is too high.
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    <a
                      href={googleSearchUrl(r.termQuery)}
                      target="_blank"
                      rel="noreferrer"
                      title={r.termQuery}
                      className="underline"
                    >
                      {formatCount(r.termHits)}
                    </a>
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    <div className="flex items-start justify-end gap-4">
                      <div>
                        <a
                          href={googleSearchUrl(r.normalizerQuery)}
                          target="_blank"
                          rel="noreferrer"
                          title={r.normalizerQuery}
                          className="underline"
                        >
                          {formatCount(r.normalizerHits)}
                        </a>
                        <div className="text-sm text-gray-500">
                          {provenance(r)}
                        </div>
                      </div>
                      {history && range && (
                        <span className="w-28 shrink-0 text-left">
                          <NormalizerSeriesChart
                            variant="spark"
                            label={r.domainLabel}
                            normalizer={history.normalizer}
                            series={history.series[r.domainKey] ?? []}
                            range={range}
                            showLabel={false}
                          />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-4 text-right font-semibold tabular-nums">
                    {grouped ? null : formatIndex(d.frequencyIndex)}
                  </td>
                </tr>
              ))}
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

const provenance = (r: FrequencyLookupRowView) => {
  const c = r.normalizerCount
  const origin = r.readHere
    ? "recorded with this lookup"
    : c.lookup
    ? `reused from “${c.lookup.term}”, ${c.observed}`
    : `from ${c.source}, ${c.observed}`
  const corrected = c.updated
    ? `; corrected ${c.updated.slice(0, 10)} by ${userName(c.updatedUser)}`
    : ""
  return origin + corrected
}
