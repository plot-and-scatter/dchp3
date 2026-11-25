import { Link } from "~/components/elements/LinksAndButtons/Link"
import type { FrequencyLookupView } from "~/models/frequencyIndex.server"
import { formatCount } from "~/models/frequencyIndex"
import LookupsTable from "./LookupsTable"

type Props = {
  lookups: FrequencyLookupView[]
  /** How many lookups are saved in all, of which `lookups` are the newest. */
  total: number
}

export default function RecentLookups({ lookups, total }: Props) {
  if (lookups.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="mb-3 text-xl font-semibold">Recent lookups</h2>
      <LookupsTable lookups={lookups} />
      {/* The list stops at the newest few; older lookups were unreachable
          until this link was added (Natalia, 2026-11-24). */}
      <p className="mt-4">
        {total > lookups.length
          ? `These are the ${lookups.length} most recent of ${formatCount(
              total
            )} lookups. `
          : null}
        <Link to="/frequency-index/lookups">See all lookups</Link>
      </p>
    </section>
  )
}
