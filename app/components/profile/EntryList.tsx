import React from "react"
import { type LogEntries } from "~/models/user.server"

interface EntryListProps {
  logEntries: LogEntries
}

const EntryList = ({ logEntries }: EntryListProps) => {
  console.log(logEntries)
  return (
    <div>
      {logEntries.map((e) => {
        return <p key={e.id}>{e.Entry?.headword}</p>
      })}
    </div>
  )
}

export default EntryList
