import type { LogEntry } from "@prisma/client"
import type { SerializeFrom } from "@remix-run/server-runtime"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import Select from "../bank/Select"
import TopLabelledField from "../bank/TopLabelledField"

interface DictionaryVersionProps {
  entry: LoadedEntryDataType
  isEditingMode?: boolean
}

const calculateDictionaryVersion = (
  dchpVersion: string | null,
  logEntries?: SerializeFrom<LogEntry>[]
): { version: string; year?: number; date: string } => {
  if (dchpVersion === "dchp1") return { version: `DCHP-1`, date: `pre-1967` }

  if (!logEntries) return { version: `Unknown`, date: `Post-DCHP-1` }

  // Filter log entries based on DCHP version cutoff dates
  let filteredLogEntries = logEntries
  if (dchpVersion === "dchp3") {
    // Filter to log entries after April 2025
    const april2025 = new Date("2025-04-01").getTime()
    filteredLogEntries = logEntries.filter(entry => Date.parse(entry.created) >= april2025)
  } else if (dchpVersion === "dchp3.1") {
    // Filter to log entries after June 2025
    const june2025 = new Date("2025-06-01").getTime()
    filteredLogEntries = logEntries.filter(entry => Date.parse(entry.created) >= june2025)
  }

  // Find the *earliest* log entry (when this was created)
  const logEntry = [...filteredLogEntries]
    .sort((a, b) => {
      const aTime = Date.parse(a.created)
      const bTime = Date.parse(b.created)
      return aTime - bTime
    })
    .shift()

  if (!logEntry) return { version: `Unknown`, date: `Post-DCHP-1` }

  const date = new Date(Date.parse(logEntry.created))
  const year = date.getFullYear()
  const localeMonth = date.toLocaleString(`en-ca`, { month: "short" })

  const version =
    dchpVersion === `dchp3.1` ? `DCHP-3.1` : `DCHP-${year >= 2018 ? 3 : 2}`

  return { version, date: `${localeMonth} ${year}` }
}

const DictionaryVersion = ({
  entry,
  isEditingMode,
}: DictionaryVersionProps): JSX.Element => {
  const { dchp_version: dchpVersion, logEntries } = entry

  const version = calculateDictionaryVersion(dchpVersion, logEntries)

  const color =
    dchpVersion === "dchp1"
      ? "border-amber-300 bg-amber-200"
      : "border-gray-200 bg-gray-100"

  if (!isEditingMode) {
    return (
      <div
        className={`border ${color} ml-2 py-1 px-2 text-xs text-gray-700 shadow-sm md:px-4 md:text-sm`}
      >
        {version.version} ({version.date})
      </div>
    )
  }

  return (
    <TopLabelledField
      label="DCHP version"
      field={
        <Select
          name="dchpVersion"
          defaultValue={dchpVersion || ""}
          lightBorder
          options={[
            { value: "dchp1", label: "DCHP-1" },
            { value: "dchp2", label: "DCHP-2" },
            { value: "dchp3", label: "DCHP-3" },
            { value: "dchp3.1", label: "DCHP-3.1" },
          ]}
        />
      }
    />
  )
}

export default DictionaryVersion
