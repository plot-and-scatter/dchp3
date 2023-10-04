import type { ReferenceLink } from "@prisma/client"
import SanitizedTextSpan from "./SanitizedTextSpan"
import { Link } from "./elements/LinksAndButtons/Link"

type EntryReferenceProps = {
  referenceLink: ReferenceLink
}

export default function EntryReference({
  referenceLink,
}: EntryReferenceProps): JSX.Element {
  return (
    <li>
      {/*  For some reason Prisma does not properly generate the 'reference'
      reference! (Maybe due to the name?) It does exist, though.
      @ts-ignore */}
      <SanitizedTextSpan text={referenceLink.reference.short_display} />
      {referenceLink.link_target && (
        <>
          {" "}
          •{" "}
          <Link to={referenceLink.link_target} target="_blank" rel="noreferrer">
            {referenceLink.link_text || "Link"}
          </Link>
        </>
      )}
    </li>
  )
}
