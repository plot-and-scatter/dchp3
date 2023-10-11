import type { LogEntry } from "@prisma/client"
import type { SerializeFrom } from "@remix-run/server-runtime"

interface DictionaryVersionProps {
  dchpVersion: string | null
  logEntries?: SerializeFrom<LogEntry>[]
}

const calculateDictionaryVersion = (
  dchpVersion: string | null,
  logEntries?: SerializeFrom<LogEntry>[]
): { version: string; year?: number; date: string } => {
  if (dchpVersion === "dchp1") return { version: `DCHP-1`, date: `pre-1967` }

  if (!logEntries) return { version: `Unknown`, date: `Post-DCHP-1` }

  // Find the *earliest* log entry (when this was created)
  const logEntry = [...logEntries]
    .sort((a, b) => {
      const aTime = Date.parse(a.created)
      const bTime = Date.parse(b.created)
      return aTime - bTime
    })
    .pop()

  if (!logEntry) return { version: `Unknown`, date: `Post-DCHP-1` }

  const date = new Date(Date.parse(logEntry.created))
  const year = date.getFullYear()
  const localeMonth = date.toLocaleString(`en-ca`, { month: "short" })

  const version = `DCHP-${year >= 2018 ? 3 : 2}`

  return { version, date: `${localeMonth} ${year}` }
}

const DictionaryVersion = ({
  dchpVersion,
  logEntries,
}: DictionaryVersionProps): JSX.Element => {
  const version = calculateDictionaryVersion(dchpVersion, logEntries)

  const color =
    dchpVersion === "dchp1"
      ? "border-amber-300 bg-amber-200"
      : "border-slate-200 bg-slate-100"

  return (
    <div
      className={`border ${color} py-1 px-2 text-xs text-slate-700 shadow-sm md:px-4 md:text-sm`}
    >
      {version.version} ({version.date})
    </div>
  )
}

export default DictionaryVersion
