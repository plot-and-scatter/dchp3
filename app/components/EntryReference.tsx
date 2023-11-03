import { Link } from "./elements/LinksAndButtons/Link"
import ReferencePopover from "./ReferencePopover"
import SanitizedTextSpan from "./SanitizedTextSpan"
import type { Reference, ReferenceLink } from "@prisma/client"
import type { SerializeFrom } from "@remix-run/server-runtime"

type EntryReferenceProps = {
  referenceLink: SerializeFrom<ReferenceLink>
}

export default function EntryReference({
  referenceLink,
}: EntryReferenceProps): JSX.Element {
  console.log(referenceLink)

  /*  For some reason Prisma does not properly generate the 'reference'
      reference! (Maybe due to the name?) It does exist, though.
      @ts-ignore */
  const reference = referenceLink.reference as Reference

  return (
    <li>
      <SanitizedTextSpan text={reference.short_display} />
      <ReferencePopover text={reference.reference_text} />
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
