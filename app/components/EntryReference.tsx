import type { ReferenceLink } from "@prisma/client"
import SanitizedTextSpan from "./SanitizedTextSpan"

type EntryReferenceProps = {
  referenceLink: ReferenceLink
}

export default function EntryReference({
  referenceLink,
}: EntryReferenceProps): JSX.Element {
  console.log("referenceLink", referenceLink)
  return (
    <li>
      <SanitizedTextSpan text={referenceLink.reference.short_display} />
      {referenceLink.link_target && (
        <>
          {" "}
          •{" "}
          <a
            href={referenceLink.link_target}
            target="_blank"
            className="text-red-500"
            rel="noreferrer"
          >
            {referenceLink.link_text || "Link"}
          </a>
        </>
      )}
    </li>
  )
}
