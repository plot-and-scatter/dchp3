import { convertToDoubleBreaks } from "~/utils/textUtils"
import DOMPurify from "isomorphic-dompurify"

interface SanitizedTextSpanProps {
  text: string | undefined | null
  toDoubleBreaks?: boolean
}

const SanitizedTextSpan = ({
  text,
  toDoubleBreaks,
}: SanitizedTextSpanProps) => {
  if (!text) return <></>

  const sanitizedText = DOMPurify.sanitize(
    toDoubleBreaks ? convertToDoubleBreaks(text) : text
  )
  return <span dangerouslySetInnerHTML={{ __html: sanitizedText }} />
}

export default SanitizedTextSpan
