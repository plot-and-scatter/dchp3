import { Link } from "~/components/elements/LinksAndButtons/Link"
import type { FrequencyLookupView } from "~/models/frequencyIndex.server"
import { formatIndex } from "~/models/frequencyIndex"
import { userName } from "./userName"

type Props = { lookups: FrequencyLookupView[] }

export default function RecentLookups({ lookups }: Props) {
  if (lookups.length === 0) return null

  const canadaIndex = (l: FrequencyLookupView) =>
    formatIndex(
      l.rows.find((r) => r.domainKey === "ca")?.frequencyIndex ?? null
    )

  return (
    <section className="mt-12">
      <h2 className="mb-3 text-xl font-semibold">Recent lookups</h2>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-gray-400">
            <th className="py-2 pr-4">Term</th>
            <th className="py-2 pr-4">Normalizer</th>
            <th className="py-2 pr-4 text-right">Canada index</th>
            <th className="py-2 pr-4">Recorded</th>
            <th className="py-2 pr-4">By</th>
          </tr>
        </thead>
        <tbody>
          {lookups.map((l) => (
            <tr key={l.id} className="border-b border-gray-200">
              <td className="py-2 pr-4">
                <Link to={`/frequency-index/${l.id}`}>{l.term}</Link>
                {l.exclusions && (
                  <span className="ml-2 text-sm text-gray-500">
                    {l.exclusions}
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">{l.normalizer}</td>
              <td className="py-2 pr-4 text-right">{canadaIndex(l)}</td>
              <td className="py-2 pr-4">
                {new Date(l.created).toLocaleDateString("en-CA")}
              </td>
              <td className="py-2 pr-4">{userName(l.user)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
