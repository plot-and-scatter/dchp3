import type { FrequencyLookupRowView } from "~/models/frequencyIndex.server"
import {
  formatCount,
  formatIndex,
  googleSearchUrl,
} from "~/models/frequencyIndex"

type Props = { rows: FrequencyLookupRowView[]; multiplier: number }

// Read-only view of a saved lookup. The counts link to the exact query they
// came from so a reviewer can re-run it and see what it was measuring.
export default function LookupRowsTable({ rows, multiplier }: Props) {
  return (
    <table className="w-full max-w-4xl border-collapse text-left">
      <thead>
        <tr className="border-b-2 border-gray-400">
          <th className="py-2 pr-4">Domain</th>
          <th className="py-2 pr-4 text-right">Term hits</th>
          <th className="py-2 pr-4 text-right">Normalizer hits</th>
          <th className="py-2 pr-4 text-right">
            Index (&times;{formatCount(multiplier)})
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-b border-gray-200">
            <td className="py-2 pr-4">
              {r.domainLabel}{" "}
              <span className="text-sm text-gray-500">{r.siteClause}</span>
            </td>
            <td className="py-2 pr-4 text-right">
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
            <td className="py-2 pr-4 text-right">
              <a
                href={googleSearchUrl(r.normalizerQuery)}
                target="_blank"
                rel="noreferrer"
                title={r.normalizerQuery}
                className="underline"
              >
                {formatCount(r.normalizerHits)}
              </a>
              {r.normalizerReusedFromId && (
                <span
                  className="ml-1 text-sm text-gray-500"
                  title="Reused from an earlier lookup"
                >
                  (reused)
                </span>
              )}
            </td>
            <td className="py-2 pr-4 text-right font-semibold">
              {formatIndex(r.frequencyIndex)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
