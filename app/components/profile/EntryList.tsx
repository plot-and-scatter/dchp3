import React from "react"
import { type LogEntries } from "~/models/user.server"
import { Link } from "../elements/LinksAndButtons/Link"

interface EntryListProps {
  logEntries: LogEntries
}

const EntryList = ({ logEntries }: EntryListProps) => {
  return (
    <div className="">
      <h2 className="text-3xl">User's Entries</h2>
      <div className="grid grid-cols-9 [&>*]:text-lg">
        {logEntries.map((e) => {
          return (
            <React.Fragment key={e.id}>
              <p className="col-span-1">Entry:</p>
              <Link
                className="col-span-3"
                bold
                to={`/entries/${e.Entry?.headword}`}
              >
                {e.Entry?.headword ?? `Deleted entry: ${e.entry_id}`}
              </Link>
              <p className="col-span-1"></p>
              <p className="col-span-1">Edited:</p>
              <p className="col-span-3">
                {new Date(e.created).toLocaleDateString()}
              </p>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default EntryList
