import { useNavigation } from "@remix-run/react"
import AddNewMeaningForm from "../EntryEditorForm/AddNewMeaningForm"
import EditingStatus from "./EditingStatus/EditingStatusPanel"
import EditingTools from "./EditingTools"
import EntryComment from "./EntryComment"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import BackIcon from "~/components/elements/Icons/BackIcon"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { useEffect, useState } from "react"
import FAIcon from "~/components/elements/Icons/FAIcon"

type EditingSidebarProps = {
  entry: LoadedEntryDataType
}

export default function EntryEditorSidebar({ entry }: EditingSidebarProps) {
  const navigation = useNavigation()

  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    if (navigation.state === "submitting") {
      setStatusMessage("Submitting...")
    }
    if (navigation.state === "loading") {
      setStatusMessage("Saved.")
      setTimeout(() => {
        setStatusMessage("")
      }, 5000)
    }
  }, [navigation.state])

  // TODO: Restore fixed status?
  return (
    <div className="sticky">
      <div className="mb-2 flex flex-row items-center gap-x-4">
        <div className="w-1/2">
          <Link
            bold
            to={`/entries/${entry.headword}`}
            className="w-full"
            appearance="secondary"
            asButton
          >
            <BackIcon /> Return to entry
          </Link>
        </div>
        <div className="my-4 h-8 text-lg leading-tight">
          {statusMessage === "Saved." ? (
            <div className="rounded border border-success-800 bg-success-400 px-4 py-1 text-white">
              <FAIcon iconName="fa-check" /> {statusMessage}
            </div>
          ) : (
            statusMessage || <>&nbsp;</>
          )}

          {/* Action: {navigation.formAction || "None"} / State: {navigation.state}
          <br />
          <span className="text-xs">(Temporary for debugging)</span> */}
        </div>
      </div>
      <AddNewMeaningForm entry={entry} />
      <hr className="my-2 border-b border-b-gray-400" />
      <EditingTools entry={entry} />
      <hr className="my-2 border-b border-b-gray-400" />
      <EditingStatus entry={entry} />
      <hr className="my-2 border-b border-b-gray-400" />
      <EntryComment entry={entry} />
    </div>
  )
}
