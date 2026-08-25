import React from "react"
import ScrollButton from "../elements/LinksAndButtons/ScrollButton"

interface QuickLinkProps {
  children: React.ReactNode
  scrollToId: string
}

const QuickLink = ({ children, scrollToId }: QuickLinkProps): JSX.Element => {
  return (
    <li>
      <ScrollButton
        scrollToId={scrollToId}
        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-left"
      >
        {children}
      </ScrollButton>
    </li>
  )
}

export default QuickLink
