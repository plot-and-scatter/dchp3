import React from "react"
import { Link } from "../elements/LinksAndButtons/Link"

interface EntryLinkProps {
  headword: string
  created: string
}

const EntryLink = ({ headword, created }: EntryLinkProps) => {
  return (
    <div className="flex flex-row">
      Entry:{" "}
      <Link bold to={`/entries/${headword}`}>
        {headword}
      </Link>
      Created: {created}
    </div>
  )
}

export default EntryLink
