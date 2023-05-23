import React from "react"
import type JSXNode from "~/types/JSXNode"
import DOMPurify from "isomorphic-dompurify"

interface SanitizedTextSpanProps {
  text: string | undefined | null
}

const SanitizedTextSpan = ({ text }: SanitizedTextSpanProps): JSXNode => {
  if (!text) return <></>
  const sanitizedText = DOMPurify.sanitize(text)
  return <span dangerouslySetInnerHTML={{ __html: sanitizedText }} />
}

export default SanitizedTextSpan
