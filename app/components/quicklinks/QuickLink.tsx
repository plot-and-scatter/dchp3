import React from "react"
import Button from "../elements/LinksAndButtons/Button"

interface QuickLinkProps {
  children: React.ReactNode
  scrollToId: string
}

const scrollTo = (elementId: string): void => {
  const element = document.getElementById(elementId)
  if (element) {
    const headerHeight = document.getElementsByTagName("header")[0].offsetHeight
    const navHeight = document.getElementsByTagName("nav")[0].offsetHeight
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition =
      elementPosition + window.pageYOffset - headerHeight - navHeight
    window.scrollTo({ top: offsetPosition, behavior: "smooth" })
  }
}

const QuickLink = ({ children, scrollToId }: QuickLinkProps): JSX.Element => {
  return (
    <li>
      <Button
        asLink
        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-left"
        onClick={() => scrollTo(scrollToId)}
      >
        {children}
      </Button>
    </li>
  )
}

export default QuickLink
