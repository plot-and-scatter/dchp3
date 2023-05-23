import React from "react"

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
      <button
        className="text-ellipsis whitespace-nowrap text-red-500"
        onClick={() => scrollTo(scrollToId)}
      >
        {children}
      </button>
    </li>
  )
}

export default QuickLink
